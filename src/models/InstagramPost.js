const mongoose = require('mongoose');

const instagramPostSchema = new mongoose.Schema({
  postName: {
    type: String,
    required: [true, 'Instagram post name is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Instagram post image URL is required'],
    trim: true
  },
  postUrl: {
    type: String,
    required: [true, 'Instagram post URL is required'],
    trim: true
  },
  active: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InstagramPost', instagramPostSchema); 