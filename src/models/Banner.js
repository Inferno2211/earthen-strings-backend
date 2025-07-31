const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Banner name is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Banner image URL is required'],
    trim: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Banner product reference is required']
  },
  active: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema); 