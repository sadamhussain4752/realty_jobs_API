// controllers/JobPost.js
const JobPost = require("../../models/ProductModel/NewModelProduct");
const { BASEURL } = require('../../utils/Constants')
const { uploadHandlers } = require("../../Image/uploadHandlers")
const axios = require('axios');
const ExcelJS = require('exceljs');
const fs = require('fs');
const LANGID = {
  1: "IND",
  2: "JPN",
  3: "KOR",
  4: "AUS",
};


exports.createJobPost = async (req, res) => {
  try {
    const {
      jobTitle,
      logo,
      company,
      company_id,
      location,
      description,
      time,
      salary,
      jobType,
      link,
      tag,
      experience,
      category_id,
      brand_id,
      sub_brand_id,
      totalSalary,
      skills,
      skills_title,
      experience_title,
      catalogueShoot
    } = req.body;

    const newJobPost = await JobPost.create({
      jobTitle,
      logo,
      company,
      company_id,
      location,
      description,
      time,
      salary,
      jobType: jobType.split(','), // Convert jobType string back to array
      link,
      tag,
      experience,
      category_id,
      brand_id,
      sub_brand_id,
      totalSalary,
      skills,
      skills_title,
      experience_title,
      catalogueShoot,
    });

    res.status(200).json({ success: true, jobPost: newJobPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get all JobPosts with pagination
exports.getAllJobPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    };

    const jobPosts = await JobPost.find();

    res.status(200).json({ success: true, jobPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get a JobPost by ID
exports.getJobPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const jobPost = await JobPost.findById(id);

    if (!jobPost) {
      return res.status(404).json({ success: false, message: "JobPost not found" });
    }

    res.status(200).json({ success: true, jobPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Update a JobPost by ID
exports.updateJobPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      jobTitle,
      logo,
      company,
      company_id,
      location,
      description,
      time,
      salary,
      jobType,
      link,
      tag,
      experience,
      category_id,
      brand_id,
      sub_brand_id,
      totalSalary,
      skills,
      skills_title,
      experience_title,
      catalogueShoot
    } = req.body;

    const updatedJobPost = await JobPost.findByIdAndUpdate(id, {
      jobTitle,
      logo,
      company,
      company_id,
      location,
      description,
      time,
      salary,
      jobType: jobType.split(','), // Convert jobType string back to array
      link,
      tag,
      experience,
      category_id,
      brand_id,
      sub_brand_id,
      totalSalary,
      skills,
      skills_title,
      experience_title,
      catalogueShoot,
    }, { new: true });

    if (!updatedJobPost) {
      return res.status(404).json({ success: false, message: "JobPost not found" });
    }

    res.status(200).json({ success: true, jobPost: updatedJobPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Delete a JobPost by ID
exports.deleteJobPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJobPost = await JobPost.findByIdAndDelete(id);

    if (!deletedJobPost) {
      return res.status(404).json({ success: false, message: "JobPost not found" });
    }

    res.status(200).json({ success: true, message: "JobPost deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
