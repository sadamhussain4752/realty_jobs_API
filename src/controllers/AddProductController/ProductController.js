// controllers/Job.js
const Job = require("../../models/ProductModel/Product");

// Controller method to get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get user-specific Jobs by language and search criteria
exports.getUserJobs = async (req, res) => {
  try {
    const { search } = req.query;
   
    const query = {
      isActive: true,  // Include only active jobs
      $or: [
        { title: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search for title
        { description: { $regex: new RegExp(search, 'i') } },  // Case-insensitive search for description
      ],
    };
    const userJobs = await Job.find(search && query);

    res.status(200).json({ success: true, data: userJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Controller method to get a job by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Controller method to create a new job
exports.createJob = async (req, res) => {
  try {
    const jobData = req.body; // Assuming request body contains job data
    const job = await Job.create(jobData);
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Controller method to delete a job by ID
exports.deleteJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Controller method to update a job by ID
exports.updateJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = req.body; // Assuming request body contains updated job data
    const job = await Job.findByIdAndUpdate(id, jobData, { new: true });
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
