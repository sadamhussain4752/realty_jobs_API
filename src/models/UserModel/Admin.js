// models/Admin.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema({
  since: { type: String },
  team_size: { type: String },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  category_type: { type: String },
  allow: { type: String },
  about: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  google: { type: String },
  country: { type: String },
  city: { type: String },
  address: { type: String },
  google: { type: String },
  lat: { type: Number, },
  log: { type: Number },
});

// Add a method to generate a AdminSchema 
AdminSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
    { ID: user._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return verificationToken;
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
