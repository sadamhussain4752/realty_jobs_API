// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String },
  description: String,
  imageUrl: String,
  isActive: { type: Boolean, default: true },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  category_img_desktop: String,
  category_img_mobile: String,
  primaryIndustry: String,      // Primary industry name
  companySize: String,          // Company size
  founder: String,              // Founder information
  phone: String,                // Phone number
  email: String,                // Email address
  location: String,             // Location
  socialMedia: {                // Social media URLs
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String
    // Add more social media platforms as needed
  }
});

const Category = mongoose.model('Company_name', categorySchema);

module.exports = Category;
