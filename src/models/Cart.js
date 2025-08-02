const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    }
}, { _id: true });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', function (next) {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    next();
});

// Add item to cart
cartSchema.methods.addItem = function (productId, quantity = 1, price) {
    const existingItem = this.items.find(item => item.product.toString() === productId.toString());

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = price; // Update price in case it changed
    } else {
        this.items.push({
            product: productId,
            quantity,
            price
        });
    }

    return this.save();
};

// Update item quantity
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
    const item = this.items.find(item => item.product.toString() === productId.toString());

    if (!item) {
        throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
        this.removeItem(productId);
    } else {
        item.quantity = quantity;
    }

    return this.save();
};

// Remove item from cart
cartSchema.methods.removeItem = function (productId) {
    this.items = this.items.filter(item => item.product.toString() !== productId.toString());
    return this.save();
};

// Clear cart
cartSchema.methods.clearCart = function () {
    this.items = [];
    return this.save();
};

// Get cart total
cartSchema.methods.getTotal = function () {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Get item count
cartSchema.methods.getItemCount = function () {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema); 