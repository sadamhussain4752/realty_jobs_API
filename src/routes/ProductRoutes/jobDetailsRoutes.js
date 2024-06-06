// routes/jobDetailsRoutes.js
const express = require('express');
const router = express.Router();
const jobDetailsController = require('../../controllers/AddProductController/ProductController');

// Route to create a new job details
router.post('/job-details', jobDetailsController.createJob);

// Route to get all job details
router.get('/job-details', jobDetailsController.getUserJobs);

// Route to get a job details by ID
router.get('/job-details/:id', jobDetailsController.getJobById);

// Route to update a job details by ID
router.put('/job-details/:id', jobDetailsController.updateJobById);

// Route to delete a job details by ID
router.delete('/job-details/:id', jobDetailsController.deleteJobById);

module.exports = router;
