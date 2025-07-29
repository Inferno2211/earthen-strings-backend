const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Category description is required'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Category image URL is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    }
}, {
    timestamps: true
});

// Create slug from name before saving
categorySchema.pre('save', function (next) {
    if (!this.isModified('name')) return next();

    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

module.exports = mongoose.model('Category', categorySchema); 