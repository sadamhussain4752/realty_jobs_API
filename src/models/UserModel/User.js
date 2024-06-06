// models/User.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  
  fullname: { type: String, required: true },
  work_status: { type: String },
  UserType: { type: String, required: true },
  mobilenumber: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String },
  lang: { type: String },
  fcm_token: { type: String },
  send_message: { type: String },
  OTPNumber: { type: Number },
  verified: {
    type: Boolean,
    default: true,
  },
  isPaidUser: {
    type: Boolean,
    default: false,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  isprofile_id: {
    type: String,
  }
});

// Add a method to generate a verification token
userSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
    { ID: user._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return verificationToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
