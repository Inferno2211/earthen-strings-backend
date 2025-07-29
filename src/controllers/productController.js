const mongoose = require('mongoose');
const Product = require('../models/Product');

// Create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            image,
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
            image,
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
        const {
            sort = 'createdAt',
            order = 'desc',
            isNew,
            published,
            artistPick,
            category,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter object
        const filter = {};

        if (isNew !== undefined) {
            filter.isNew = isNew === 'true';
        }

        if (published !== undefined) {
            filter.published = published === 'true';
        }

        if (artistPick !== undefined) {
            filter.artistPick = artistPick === 'true';
        }

        if (category) {
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

        // Build sort object
        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

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

        // Update all fields except slug (which is auto-generated)
        Object.keys(updateData).forEach(key => {
            if (key !== 'slug') {
                product[key] = updateData[key];
            }
        });

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

// Toggle boolean fields
const toggleProductField = async (req, res) => {
    try {
        const { id } = req.params;
        const { field } = req.body;

        const allowedFields = ['isNew', 'published', 'artistPick'];

        if (!allowedFields.includes(field)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid field. Allowed fields: isNew, published, artistPick'
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

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
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