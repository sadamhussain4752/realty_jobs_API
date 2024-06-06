const mongoose = require('mongoose');

// Define default values for empty fields
const defaultString = { type: String, default: '' };
const defaultNumber = { type: Number, default: 0 };
const defaultBoolean = { type: Boolean, default: false };
const defaultDate = { type: Date, default: Date.now };
const defaultArray = { type: Array, default: [] };

const EducationSchema = new mongoose.Schema({
    courseType: defaultString,
    courseId: defaultNumber,
    courseValue: defaultString,
    courseSubValue: defaultString,
    specialisationId: defaultNumber,
    specialisationValue: defaultString,
    specialisationSubValue: defaultString,
    institute: defaultString,
    educationTypeId: defaultNumber,
    educationTypeValue: defaultString,
    educationTypeSubValue: defaultString,
    grade: defaultString,
    marks: defaultString,
    educationId: defaultString,
    yearOfStart: defaultNumber,
    yearOfCompletion: defaultNumber,
    entityInstituteId: defaultString,
    entityInstituteValue: defaultString,
    isPrimary: defaultNumber,
    profileId: defaultString,
    projects: defaultString
});

const ProfileSchema = new mongoose.Schema({
    profileName: defaultString,
    profileId: defaultString,
    name: defaultString,
    keySkills: defaultString,
    resumeHeadline: defaultString,
    birthDate: defaultDate,
    gender: defaultString,
    mailCity: defaultString,
    industryId: defaultNumber,
    industryValue: defaultString,
    functionalAreaId: defaultNumber,
    functionalAreaValue: defaultString,
    roleId: defaultNumber,
    roleValue: defaultString,
    locationPrefId: [{ id: defaultNumber, value: defaultString }],
    newLocationPrefId: [{ id: defaultNumber, value: defaultString }],
    cityId: defaultNumber,
    cityValue: defaultString,
    countryId: defaultNumber,
    countryValue: defaultString,
    experienceMonth: defaultString,
    experienceYear: defaultString,
    entityIndustryTypeId: defaultNumber,
    entityIndustryTypeValue: defaultString,
    entityIndustryId: defaultNumber,
    entityIndustryValue: defaultString,
    predictiveResumeHeadline: defaultString,
    lastModTime: defaultDate,
    cvInfo: {
        cvFormat: defaultString,
        uploadDate: defaultDate,
        fileName: defaultString,
        source: defaultString,
        isAvailable: defaultBoolean,
        isTextResume: defaultBoolean
    },
    isActiveProfile: defaultBoolean,
    pc: defaultNumber
});

const UserSchema = new mongoose.Schema({
    username: defaultString,
    email: defaultString,
    mobile: defaultString,
    resdexVisibility: defaultString,
    canChooseProfileDuringApply: defaultBoolean,
    creationDate: defaultDate,
    hasCertifications: defaultBoolean,
    hasVoiceProfile: defaultBoolean,
    hasInbox: defaultBoolean,
    dnaEmv: defaultString,
    hasFreeCvSearch: defaultBoolean,
    isFeatured: defaultBoolean,
    isVerifiedViaCrederity: defaultBoolean,
    lastThirtyDaysApplicationCount: defaultString,
    alternateEmail: defaultString,
    isMobileVerified: defaultBoolean,
    isEmailVerified: defaultBoolean,
    isSecondaryEmailVerified: defaultBoolean,
    isPremium: defaultBoolean
});

const UserDetailSchema = new mongoose.Schema({
    user: UserSchema,
    itskills: defaultArray,
    certifications: defaultArray,
    educations: [EducationSchema], // Assuming empty array is okay
    employments: defaultArray,
    projects: defaultArray,
    schools: defaultArray,
    languages: defaultArray,
    noticePeriod: defaultArray,
    onlineProfile: defaultArray,
    presentation: defaultArray,
    patent: defaultArray,
    publication: defaultArray,
    workSample: defaultArray,
    lookupData: {
        resumeScore: defaultNumber,
        isInt360paidUser: defaultBoolean
    },
    profile: [ProfileSchema] // Assuming empty array is okay
});

const UserDetailModel = mongoose.model('userdetails', UserDetailSchema);

module.exports = UserDetailModel;
