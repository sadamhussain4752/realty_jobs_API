// routes/EmployeeRoutes.js
const express = require('express');
const router = express.Router();
const CompanyController = require('../../controllers/AddCompanyController/CompanyController');

// Create a new employee
router.post('/createCompany', CompanyController.createCompany);

// Get details of a specific employee by ID
router.get('/getCompany/:id', CompanyController.getCompany);

// Update details of an employee
router.put('/updateCompany/:id', CompanyController.updateCompany);

// Delete an employee
router.delete('/deleteCompany/:id', CompanyController.deleteCompany);

router.get('/getAllCompany', CompanyController.getAllCompanies);

router.get('/getCompanyById/:id', CompanyController.getCompanyById);

module.exports = router;
