const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { deleteImageFromCloudinary } = require('../utils/cloudinaryUtils');

// Create category
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const category = new Category({
            name,
            description,
            image
        });

        await category.save();

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Fetch one category by ID or slug
const getCategory = async (req, res) => {
    try {
        const { id } = req.params;

        let category;
        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findById(id);
        } else {
            category = await Category.findOne({ slug: id });
        }

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Fetch all categories
const getAllCategories = async (req, res) => {
    try {
        const { sort = 'name', order = 'asc' } = req.query;

        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        const categories = await Category.find().sort(sortOptions);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image } = req.body;

        let category;
        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findById(id);
        } else {
            category = await Category.findOne({ slug: id });
        }

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        // Delete old image if new image is provided
        if (image && category.image && image !== category.image) {
            await deleteImageFromCloudinary(category.image);
        }

        if (name) category.name = name;
        if (description) category.description = description;
        if (image) category.image = image;

        await category.save();

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        let category;
        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findByIdAndDelete(id);
        } else {
            category = await Category.findOneAndDelete({ slug: id });
        }

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        // Delete associated image from Cloudinary
        if (category.image) {
            await deleteImageFromCloudinary(category.image);
        }

        res.status(200).json({
            success: true,
            message: 'Category and associated image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get products by category group
const getCategorizedProducts = async (req, res) => {
    try {
        const { category } = req.params;
        
        // Category mapping
        const categoryMap = {
            'tableware': ['trinket-boxes', 'cutlery-boxes', 'calendars', 'serving-trays', 'bowls', 'plates', 'tea-sets'],
            'accessories': ['magnets', 'coasters', 'keychains', 'bookmarks', 'badges', 'pins'],
            'wall-decor': ['wallplates', 'wall-plates', 'wall-decor', 'paintings', 'frames', 'wall-hangings', 'art-pieces']
        };

        let categoryNames = categoryMap[category] || [category];
        
        // Find matching categories
        const categories = await Category.find({
            $or: [
                { slug: { $in: categoryNames } },
                { name: { $regex: new RegExp(categoryNames.join('|'), 'i') } }
            ]
        });

        const categoryIds = categories.map(cat => cat._id);
        
        // Get products in these categories
        const products = await Product.find({ 
            category: { $in: categoryIds },
            published: true 
        }).populate('category').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            type: category,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createCategory,
    getCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategorizedProducts
}; 