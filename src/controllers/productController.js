const mongoose = require('mongoose');
const Product = require('../models/Product');
const { deleteImageFromCloudinary } = require('../utils/cloudinaryUtils');

// Create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            images,
            category,
            price,
            description,
            isNew,
            published,
            artistPick,
            details
        } = req.body;

        const product = new Product({
            name,
            images,
            category,
            price,
            description,
            isNew: isNew || false,
            published: published || false,
            artistPick: artistPick || false,
            details
        });

        await product.save();

        // Populate category info
        await product.populate('category', 'name slug');

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Fetch one product by ID or slug
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        let product;
        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id).populate('category', 'name slug');
        } else {
            product = await Product.findOne({ slug: id }).populate('category', 'name slug');
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Fetch all products with filtering and sorting
const getAllProducts = async (req, res) => {
    try {
        // console.log('Received query params:', req.query);
        const {
            sort = 'createdAt',
            order = 'desc',
            isNew,
            published,
            artistPick,
            category,
            categories,
            materials,
            colors,
            minPrice,
            maxPrice,
            search,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter object
        const filter = {};

        // Text search
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Boolean filters
        if (isNew !== undefined) {
            filter.isNewProduct = isNew === 'true';
        }

        if (published !== undefined) {
            filter.published = published === 'true';
        }

        if (artistPick !== undefined) {
            filter.artistPick = artistPick === 'true';
        }

        // Category filters
        if (categories) {
            const categoryIds = categories.split(',').map(id => id.trim());
            filter.category = { $in: categoryIds };
        } else if (category) {
            if (mongoose.Types.ObjectId.isValid(category)) {
                filter.category = category;
            } else {
                // If category is a slug, we need to find the category first
                const Category = require('../models/Category');
                const categoryDoc = await Category.findOne({ slug: category });
                if (categoryDoc) {
                    filter.category = categoryDoc._id;
                }
            }
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Material and color filters
        if (materials || colors) {
            filter.details = {};
            if (materials) {
                const materialList = materials.split(',').map(m => m.trim());
                filter.details.material = { $in: materialList };
            }
            if (colors) {
                const colorList = colors.split(',').map(c => c.trim());
                filter.details.color = { $in: colorList };
            }
        }

        // Build sort object
        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        //console.log('Final filter object:', JSON.stringify(filter, null, 2));

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        let product;
        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id);
        } else {
            product = await Product.findOne({ slug: id });
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Delete old images if new images are provided
        if (updateData.images && product.images && JSON.stringify(updateData.images) !== JSON.stringify(product.images)) {
            // Delete old images that are not in the new images array
            const imagesToDelete = product.images.filter(img => !updateData.images.includes(img));
            for (const imageUrl of imagesToDelete) {
                await deleteImageFromCloudinary(imageUrl);
            }
        }

        // Update all fields except slug (which is auto-generated)
        Object.keys(updateData).forEach(key => {
            if (key !== 'slug') {
                product[key] = updateData[key];
            }
        });

        const updatedProduct = await Product.findByIdAndUpdate(
            product._id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name slug');

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Toggle boolean fields
const toggleProductField = async (req, res) => {
    try {
        const { id } = req.params;
        const { field } = req.body;

        const allowedFields = ['isNewProduct', 'published', 'artistPick'];

        if (!allowedFields.includes(field)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid field. Allowed fields: isNewProduct, published, artistPick'
            });
        }

        let product;
        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id);
        } else {
            product = await Product.findOne({ slug: id });
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Toggle the field
        product[field] = !product[field];
        await product.save();
        await product.populate('category', 'name slug');

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        let product;
        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findByIdAndDelete(id);
        } else {
            product = await Product.findOneAndDelete({ slug: id });
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Delete associated images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                await deleteImageFromCloudinary(imageUrl);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Product and associated image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    toggleProductField,
    deleteProduct
}; 