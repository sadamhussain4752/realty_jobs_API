  // models/JobPost.js
  const mongoose = require('mongoose');

  const jobPostSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    logo: String,
    company: { type: String, required: true },
    company_id: String, // Assuming a reference to a Company model
    location: {
      type: { type: String, default: 'Point' }, // GeoJSON type
      coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    },    description: String,
    time: String,
    salary: String,
    jobType: [String], // Assuming jobType is an array of strings
    link: String,
    tag: [String],
    experience: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Assuming a reference to a Category model
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }, // Assuming a reference to a Brand model
    sub_brand_id: String, // Assuming a reference to a SubBrand model
    totalSalary: String,
    skills: String,
    skills_title: String,
    experience_title: String,
    catalogueShoot: String,
    images: [{ type: String }], // Assuming storing image URLs as strings
    locations: [{
      type: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    }],
    createdAt: { type: Date, default: Date.now },
    postedDate: { type: Date },
    expirdDate: { type: Date },


  });

  const JobPost = mongoose.model('JobPost', jobPostSchema);

  module.exports = JobPost;
