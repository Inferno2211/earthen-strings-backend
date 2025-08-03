const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    images: [{
        type: String,
        required: [true, 'Product image URL is required'],
        trim: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    isNewProduct: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: false
    },
    artistPick: {
        type: Boolean,
        default: false
    },
    details: {
        length: {
            type: Number,
            min: [0, 'Length cannot be negative']
        },
        width: {
            type: Number,
            min: [0, 'Width cannot be negative']
        },
        height: {
            type: Number,
            min: [0, 'Height cannot be negative']
        },
        material: {
            type: String,
            trim: true
        },
        color: {
            type: String,
            trim: true
        }
    }
}, {
    timestamps: true
});

// Create slug from name before saving
productSchema.pre('save', function (next) {
    if (!this.isModified('name')) return next();

    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

module.exports = mongoose.model('Product', productSchema); 