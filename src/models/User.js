const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');

const addressSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['shipping', 'billing'],
        required: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { _id: true });

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    lastLogin: {
        type: Date,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    addresses: [addressSchema],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.methods.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
};

// Check if user is admin
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

// Add to wishlist
userSchema.methods.addToWishlist = function (productId) {
    if (!this.wishlist.includes(productId)) {
        this.wishlist.push(productId);
    }
    return this.save();
};

// Remove from wishlist
userSchema.methods.removeFromWishlist = function (productId) {
    this.wishlist = this.wishlist.filter(id => id.toString() !== productId.toString());
    return this.save();
};

// Clear wishlist
userSchema.methods.clearWishlist = function () {
    this.wishlist = [];
    return this.save();
};

// Add address
userSchema.methods.addAddress = function (addressData) {
    if (addressData.isDefault) {
        this.addresses.forEach(addr => addr.isDefault = false);
    }
    this.addresses.push(addressData);
    return this.save();
};

// Update address
userSchema.methods.updateAddress = function (addressId, addressData) {
    const address = this.addresses.id(addressId);
    if (!address) throw new Error('Address not found');

    if (addressData.isDefault) {
        this.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, addressData);
    return this.save();
};

// Remove address
userSchema.methods.removeAddress = function (addressId) {
    this.addresses = this.addresses.filter(addr => addr._id.toString() !== addressId.toString());
    return this.save();
};

// Get default address by type
userSchema.methods.getDefaultAddress = function (type) {
    return this.addresses.find(addr => addr.type === type && addr.isDefault) ||
        this.addresses.find(addr => addr.type === type) ||
        this.addresses.find(addr => addr.isDefault);
};

// Add pagination plugin
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema); 