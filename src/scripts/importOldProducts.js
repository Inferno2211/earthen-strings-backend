const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const mongoose = require('mongoose');
const https = require('https');
const sharp = require('sharp');

const connectDB = require('../db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadImage } = require('../services/cloudinaryService');


const IMAGES_DIR = path.resolve(__dirname, '..', 'data', 'images');
const TMP_DIR = path.join(IMAGES_DIR, '.tmp');
const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const MAX_BYTES = 10 * 1024 * 1024; // 10MB Cloudinary free plan limit

function ensureTmpDir() {
	if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

function refToLocalStem(ref) {
	if (!ref || typeof ref !== 'string') return null;
	if (!ref.startsWith('image-')) return null;
	const withoutPrefix = ref.slice('image-'.length);
	const lastDash = withoutPrefix.lastIndexOf('-');
	if (lastDash === -1) return null;
	return withoutPrefix.slice(0, lastDash);
}

function findLocalImagePath(stem) {
	if (!stem) return null;
	for (const ext of SUPPORTED_EXTS) {
		const candidate = path.join(IMAGES_DIR, `${stem}${ext}`);
		if (fs.existsSync(candidate)) return candidate;
	}
	const files = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : [];
	const match = files.find(f => f.toLowerCase().startsWith(stem.toLowerCase() + '.'));
	return match ? path.join(IMAGES_DIR, match) : null;
}

function buildSanityCdnUrl(ref) {
	if (!SANITY_PROJECT_ID || !SANITY_DATASET) return null;
	if (!ref || typeof ref !== 'string' || !ref.startsWith('image-')) return null;
	const body = ref.replace(/^image-/, '');
	const lastDash = body.lastIndexOf('-');
	if (lastDash === -1) return null;
	const base = body.slice(0, lastDash);
	const format = body.slice(lastDash + 1);
	return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${base}.${format}`;
}

function downloadToTemp(url) {
	return new Promise((resolve, reject) => {
		try {
			ensureTmpDir();
			const fileName = path.basename(new URL(url).pathname);
			const target = path.join(TMP_DIR, fileName);

			const file = fs.createWriteStream(target);
			https.get(url, response => {
				if (response.statusCode !== 200) {
					return reject(new Error(`Download failed with status ${response.statusCode}`));
				}
				response.pipe(file);
				file.on('finish', () => file.close(() => resolve(target)));
			}).on('error', err => {
				fs.unlink(target, () => reject(err));
			});
		} catch (e) {
			reject(e);
		}
	});
}

async function compressIfNeeded(inputPath) {
	try {
		const stat = fs.statSync(inputPath);
		if (stat.size <= MAX_BYTES) return inputPath; // no need

		ensureTmpDir();
		const baseName = path.basename(inputPath).replace(path.extname(inputPath), '');
		let quality = 80;
		let widthLimit = 2000; // start large, we will reduce if needed
		let outputPath = path.join(TMP_DIR, `${baseName}-compressed.jpg`);

		for (let i = 0; i < 5; i++) {
			await sharp(inputPath)
				.resize({ width: widthLimit, withoutEnlargement: true })
				.jpeg({ quality, mozjpeg: true })
				.toFile(outputPath);
			const outStat = fs.statSync(outputPath);
			if (outStat.size <= MAX_BYTES) return outputPath;
			// tighten constraints
			quality = Math.max(40, quality - 10);
			widthLimit = Math.max(1000, Math.floor(widthLimit * 0.8));
		}
		// Final attempt very compressed
		await sharp(inputPath)
			.resize({ width: 1000, withoutEnlargement: true })
			.jpeg({ quality: 40, mozjpeg: true })
			.toFile(outputPath);
		const finalStat = fs.statSync(outputPath);
		return finalStat.size <= MAX_BYTES ? outputPath : inputPath; // fallback to original if still too big
	} catch (e) {
		return inputPath; // if compression fails, fallback to original
	}
}

const uploadCache = new Map();

async function uploadLocalOrRemoteAndGetUrl(stem, fullRef) {
	// Try local first
	let filePath = findLocalImagePath(stem);
	let cacheKey = null;
	if (filePath) {
		cacheKey = filePath;
		if (uploadCache.has(cacheKey)) return uploadCache.get(cacheKey);
		filePath = await compressIfNeeded(filePath);
		const res = await uploadImage(filePath, 'earthen-strings/products', {
			eager: [
				{ width: 200, crop: 'scale' },
				{ width: 400, crop: 'scale' },
				{ width: 600, crop: 'scale' }
			]
		});
		if (!res?.success) throw new Error(res?.error || 'Cloudinary upload failed');
		uploadCache.set(cacheKey, res.url);
		return res.url;
	}

	// Fallback: download from Sanity CDN, then upload
	const cdnUrl = buildSanityCdnUrl(fullRef);
	if (!cdnUrl) return null;
	filePath = await downloadToTemp(cdnUrl);
	cacheKey = filePath;
	if (uploadCache.has(cacheKey)) return uploadCache.get(cacheKey);
	filePath = await compressIfNeeded(filePath);
	const res = await uploadImage(filePath, 'earthen-strings/products', {
		eager: [
			{ width: 200, crop: 'scale' },
			{ width: 400, crop: 'scale' },
			{ width: 600, crop: 'scale' }
		]
	});
	if (!res?.success) throw new Error(res?.error || 'Cloudinary upload failed');
	uploadCache.set(cacheKey, res.url);
	return res.url;
}

async function findOrCreateCategoryByName(name) {
	if (!name) return null;
	let category = await Category.findOne({ name });
	if (category) return category;
	category = new Category({
		name,
		description: 'Imported from legacy content',
		image: 'https://placehold.co/600x400?text=Category',
	});
	await category.save();
	return category;
}

function normalizeProductRecord(record) {
	const name = record?.name?.trim();
	if (!name) return null;

	const description = (record?.description && String(record.description).trim()) || 'Imported from legacy content';
	const price = typeof record?.price === 'number' ? record.price : 0;
	const imageInfo = Array.isArray(record?.image)
		? record.image.map(img => ({ stem: refToLocalStem(img?.asset?._ref), fullRef: img?.asset?._ref })).filter(x => x.stem)
		: [];
	const categoryName = record?.category?.name || null;
	const slugCurrent = record?.slug?.current || null;

	return { name, description, price, imageInfo, categoryName, slugCurrent };
}

async function buildImagesArray(imageInfo) {
	const urls = [];
	for (const { stem, fullRef } of imageInfo) {
		try {
			const url = await uploadLocalOrRemoteAndGetUrl(stem, fullRef);
			if (url) urls.push(url);
		} catch (e) {
			console.error('Image handling failed for', stem, e.message);
		}
	}
	return urls;
}

async function upsertProduct(doc) {
	const category = await findOrCreateCategoryByName(doc.categoryName);
	const categoryId = category?._id;

	const query = doc.slugCurrent ? { slug: doc.slugCurrent } : { name: doc.name };
	let product = await Product.findOne(query);

	if (!product) {
		const images = await buildImagesArray(doc.imageInfo);
		product = new Product({
			name: doc.name,
			description: doc.description,
			price: doc.price,
			category: categoryId,
			images,
			published: false,
			isNewProduct: false,
			artistPick: false,
		});
		if (doc.slugCurrent) {
			product.slug = doc.slugCurrent;
		}
		await product.save();
		return { product, created: true };
	}

	// Keep existing images if present
	product.name = doc.name;
	product.description = doc.description;
	product.price = doc.price;
	if (categoryId) product.category = categoryId;
	if (!Array.isArray(product.images) || product.images.length === 0) {
		const images = await buildImagesArray(doc.imageInfo);
		if (images.length > 0) product.images = images;
	}
	if (doc.slugCurrent) product.slug = doc.slugCurrent;
	await product.save();
	return { product, created: false };
}

async function run() {
	try {
		await connectDB();
		const jsonPath = path.resolve(__dirname, '..', 'data', 'oldProducts.json');
		const raw = fs.readFileSync(jsonPath, 'utf-8');
		const parsed = JSON.parse(raw);
		const records = Array.isArray(parsed?.result) ? parsed.result : [];

		if (records.length === 0) {
			console.log('No records found to import.');
			process.exit(0);
		}

		console.log(`Found ${records.length} records. Starting import...`);
		let createdCount = 0;
		let updatedCount = 0;
		let skippedCount = 0;

		for (const rec of records) {
			const norm = normalizeProductRecord(rec);
			if (!norm) {
				skippedCount++;
				continue;
			}
			try {
				const { created } = await upsertProduct(norm);
				if (created) createdCount++; else updatedCount++;
			} catch (e) {
				skippedCount++;
				console.error('Failed to import record', norm?.name, e.message);
			}
		}

		console.log(`Import complete. Created: ${createdCount}, Updated: ${updatedCount}, Skipped: ${skippedCount}`);
		await mongoose.connection.close();
		process.exit(0);
	} catch (err) {
		console.error(err);
		await mongoose.connection.close();
		process.exit(1);
	}
}

run(); 