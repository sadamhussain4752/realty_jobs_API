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
  },
  kycStatus: String,            // KYC Status
  panNumber: String,            // PAN Number
  nameOnPanCard: String,        // Name on PAN Card
  addressLabel: String,         // Address Label
  address: String,              // Address
  country: String,              // Country
  state: String,                // State
  city: String,                 // City
  pincode: String,              // Pincode
  gstin: String,                // GSTIN
  username: String,             // Username
  emailForCommunication: String,// Email for Communication
  role: String,                 // Role
  reportingManager: String,     // Reporting Manager
  mobileNumber: String,         // Mobile Number
  industryType: String,         // Industry Type
  contactPerson: String,        // Contact Person
  alias: String,                // Alias
  contactPersonDesignation: String, // Contact Person's Designation
  websiteUrl: String,           // Website URL
  phoneNumber1: String,         // Phone Number 1
  phoneNumber2: String,         // Phone Number 2
  faxNumber: String,            // Fax Number
  tanNumber: String             // TAN Number
});

const Category = mongoose.model('Company_name', categorySchema);

module.exports = Category;
