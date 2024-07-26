// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const { uploadHandler } = require("../../Image/multerSetup")
const ProductController = require("../../controllers/AddProductController/ProductController");




// Create a new Product
router.post("/addjobpost", uploadHandler, ProductController.createJobPost);

// Get all categories
router.get("/alljobpost", ProductController.getAllJobPosts);

// Get a specific Product by ID
router.get("/jobpost/:id", ProductController.getJobPostById);



// Updated a specific Product by ID
router.put("/jobpost/:id",uploadHandler, ProductController.updateJobPostById);

router.delete("/jobpost/:id", ProductController.deleteJobPostById);

module.exports = router;
