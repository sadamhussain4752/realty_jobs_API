const Company = require("../../models/AddCompany/CompanyModel"); // Adjust the path and model name accordingly
const JobPost = require("../../models/ProductModel/NewModelProduct");

const createCompany = async (req, res) => {
  try {
    const companyData = req.body;
    console.log(companyData);

    // Validate and set default values
    const newCompany = await Company.create({
      name: companyData.name || '',
      description: companyData.description || '',
      imageUrl: companyData.imageUrl || '',
      isActive: companyData.isActive || false,
      createdBy: companyData.createdBy || '',
      createdAt: companyData.createdAt || new Date(),
      lang: companyData.lang || '',
      category_img_desktop: companyData.category_img_desktop || '',
      category_img_mobile: companyData.category_img_mobile || '',
      primaryIndustry: companyData.primaryIndustry || '',
      companySize: companyData.companySize || '',
      founder: companyData.founder || '',
      phone: companyData.phone || '',
      email: companyData.email || '',
      location: companyData.location || '',
      socialMedia: {
        facebook: companyData.socialMedia?.facebook || '',
        twitter: companyData.socialMedia?.twitter || '',
        linkedin: companyData.socialMedia?.linkedin || '',
        instagram: companyData.socialMedia?.instagram || '',
        youtube: companyData.socialMedia?.youtube || ''
      },
      kycStatus: companyData.kycStatus || '',
      panNumber: companyData.panNumber || '',
      nameOnPanCard: companyData.nameOnPanCard || '',
      addressLabel: companyData.addressLabel || '',
      address: companyData.address || '',
      country: companyData.country || '',
      state: companyData.state || '',
      city: companyData.city || '',
      pincode: companyData.pincode || '',
      gstin: companyData.gstin || '',
      username: companyData.username || '',
      emailForCommunication: companyData.emailForCommunication || '',
      role: companyData.role || '',
      reportingManager: companyData.reportingManager || '',
      mobileNumber: companyData.mobileNumber || '',
      industryType: companyData.industryType || '',
      contactPerson: companyData.contactPerson || '',
      alias: companyData.alias || '',
      contactPersonDesignation: companyData.contactPersonDesignation || '',
      websiteUrl: companyData.websiteUrl || '',
      phoneNumber1: companyData.phoneNumber1 || '',
      phoneNumber2: companyData.phoneNumber2 || '',
      faxNumber: companyData.faxNumber || '',
      tanNumber: companyData.tanNumber || ''
    });

    res.status(200).json({
      success: true,
      message: 'Company created successfully',
      data: newCompany
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    const jobPosts = await JobPost.find({ company_id: company._id });
    console.log(jobPosts,"jobPosts");

    const companyWithJobs = {
      ...company.toObject(), // Convert the Mongoose document to a plain JavaScript object
      jobs: jobPosts
    };
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }
    res.status(200).json({ success: true, Data: companyWithJobs });
  } catch (error) {
    console.error('Error getting company:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the company ID is passed as a URL parameter
    const company = await Company.findById(id);

    if (!company) {
    return res.status(404).json({ success: false, error: 'Company not found' });
    }

    const jobPosts = await JobPost.find({ company_id: company._id });

    const companyWithJobs = {
      ...company.toObject(), // Convert the Mongoose document to a plain JavaScript object
      jobs: jobPosts
    };

    res.status(200).json({ success: true, data: companyWithJobs });
  } catch (error) {
    console.error('Error getting company:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};



const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const updatedCompanyData = req.body;
    const updatedCompany = await Company.findByIdAndUpdate(companyId, updatedCompanyData, { new: true });
    if (!updatedCompany) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const deletedCompany = await Company.findByIdAndDelete(companyId);
    if (!deletedCompany) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }
    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ success: true, companies: companies });
  } catch (error) {
    console.error('Error getting all companies:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyById
};
