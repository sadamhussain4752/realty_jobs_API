const mongoose = require('mongoose');

// Define the jobDetails schema
const JobDetailsSchema = new mongoose.Schema({
  template: { type: String, default: '' },
  applyRedirectUrl: { type: String, default: '' },
  savedJobFlag: { type: Number, default: 0 },
  education: {
    doesNotMatter: { type: Boolean, default: false },
    ug: [{ type: String, default: '' }],
    pg: [{ type: String, default: '' }],
    ppg: [{ type: String, default: '' }],
    degreeCombination: { type: String, default: '' },
    bTechPremium: { type: Boolean, default: false },
    mbaPremium: { type: Boolean, default: false },
    premiumProcessed: { type: Boolean, default: false },
    label: { type: String, default: '' },
    isSchool: { type: Boolean, default: false }
  },
  hideApplyButton: { type: Boolean, default: false },
  applyCount: { type: Number, default: 0 },
  groupId: { type: Number, default: 0 },
  description: { type: String, default: '' },
  staticCompanyName: { type: String, default: '' },
  roleCategory: { type: String, default: '' },
  industry: { type: String, default: '' },
  staticUrl: { type: String, default: '' },
  title: { type: String, default: '' },
  mode: { type: String, default: '' },
  tagLabels: [{ type: String, default: '' }],
  walkIn: { type: Boolean, default: false },
  maximumExperience: { type: Number, default: 0 },
  jobRole: { type: String, default: '' },
  logStr: { type: String, default: '' },
  viewCount: { type: Number, default: 0 },
  jobType: { type: String, default: '' },
  minimumExperience: { type: Number, default: 0 },
  isTopGroup: { type: Number, default: 0 },
  employmentType: { type: String, default: '' },
  wfhType: { type: String, default: '' },
  banner: { type: String, default: '' },
  microsite: { type: Boolean, default: false },
  companyDetail: {
    name: { type: String, default: '' },
    details: { type: String, default: '' },
    address: { type: String, default: '' },
    media: {
      ppt: { type: String, default: '' },
      video: { type: String, default: '' },
      photos: [{ type: String, default: '' }]
    }
  },
  jobIconType: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  consent: { type: Boolean, default: false },
  jobId: { type: String, default: '' },
  companyId: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
  consultant: { type: Boolean, default: false },
  brandingTags: [{ type: String, default: '' }],
  functionalArea: { type: String, default: '' },
  fatFooter: { type: Object, default: {} },
  showRecruiterDetail: { type: Boolean, default: false },
  locations: [{
    localities: [{ type: String, default: '' }],
    label: { type: String, default: '' },
    url: { type: String, default: '' }
  }],
  companyApplyUrl: { type: String, default: '' },
  keySkills: {
    other: [{
      clickable: { type: String, default: '' },
      label: { type: String, default: '' }
    }],
    preferred: [{ type: String, default: '' }]
  },
  referenceCode: { type: String, default: '' },
  vacancy: { type: Number, default: 0 },
  salaryDetail: {
    minimumSalary: { type: Number, default: 0 },
    maximumSalary: { type: Number, default: 0 },
    currency: { type: String, default: '' },
    hideSalary: { type: Boolean, default: false },
    variablePercentage: { type: Number, default: 0 },
    label: { type: String, default: '' }
  },
  board: { type: String, default: '' }
});


// Define the Product model
const Product = mongoose.model('Product', JobDetailsSchema);

module.exports = Product;
