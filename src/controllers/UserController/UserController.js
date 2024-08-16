const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/UserModel/User");
const Admin = require("../../models/UserModel/Admin");
const Companys = require("../../models/AddCompany/CompanyModel");
const JobPost = require("../../models/ProductModel/NewModelProduct");
const AddCart = require('../../models/AddCart/AddCartModel');

const transporter = require("../../utils/emailConfig");
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');


// Load client secrets from a local file.
const CREDENTIALS_PATH = 'path/to/credentials.json'; // Update this path to your credentials file
const TOKEN_PATH = 'path/to/token.json'; // Update this path to where you want to store the token


const RESPONSE_MESSAGES = {
  EMAIL_TAKEN: "Email is already taken",
  MOBILE_TAKEN: "Mobile number is already taken",
  USERNAME_TAKEN: "Username is already taken",
  SERVER_ERROR: "Server error",
};

// Generate a unique token using uuid
const generateToken = () => {
  return uuidv4();
};

// Function to check if a field is already taken
const isFieldTaken = async (field, value, errorMessage) => {
  const existingUser = await User.findOne({ [field]: value });
  if (existingUser) {
    return { success: false, error: errorMessage };
  }
  return null;
};

// Send reset email
const sendResetEmail = async (userEmail, resetToken) => {
  const resetLink = `http://localhost:5000/reset?token=${resetToken}`;

  const mailOptions = {
    from: "sadamimsolutions@gmail.com",
    to: userEmail,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

// Send reset email
const sendVerificationEmail = async (email,otp) => {
  const mailOptions = {
    from: "sadamimsolutions@gmail.com",
    to: email,
    subject: "Account Verification",
    html: `<p>Thank you for registering! Please click the link to verify your account OTP ${otp}.</p>`,
  };
  await transporter.sendMail(mailOptions);
};
const updateUser = async (userId, updateData) => {
  try {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    throw error;
  }
};

const updateAdmin = async (adminId, updateData) => {
  try {
    return await Admin.findOneAndUpdate({ admin_id: adminId }, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.error(`Error updating admin: ${error.message}`);
    throw error;
  }
};

async function sendVerificationSMS(phoneNumber) {
  const apiKey = "07a81cfd6463953ac8e5f3a9d43c1985";
  const sender = "LHEROS";
  const templateId = "1607100000000307605";
  const verificationCode = generateVerificationCode(); // Implement your own function to generate a verification code

  const smsData = {
    key: apiKey,
    route: 2,
    sender: sender,
    number: phoneNumber,
    sms: `One time verification code for buy back is : ${verificationCode} -LOCAL HEROS`,
    templateid: templateId
  };

  try {
    const response = await axios.get('http://site.ping4sms.com/api/smsapi', {
      params: smsData
    });

    // Assuming the response provides some confirmation of successful SMS delivery,
    // you can handle it here based on the structure of the response.
    console.log("SMS Sent Successfully:", response.data);

    return verificationCode;
  } catch (error) {
    console.error("Error sending verification SMS:", error);
  }
}

// Function to generate a random verification code (replace this with your own logic)
function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}


const sendEmail = async (email, otp) => {
  try {
   
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "sadam@imsolutions.mobi",
        pass: "dubdhyzvluxegnke",
      },
    });

    await transporter.verify();
    
    await transporter.sendMail({
      from: "sadamimsolutions@gmail.com",
      to: email,
      subject: "Account Verification",
      html: `<p>Thank you for registering! Please click the link to verify your account OTP ${otp}.</p>`,
    });

    console.log('Email sent successfully!');
    return {
      status: 200
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 500,
      error
    };
  }
};

module.exports = {
  login: async (req, res) => {
    const { email, password, mobilenumber,google_signin,fcm_token } = req.body;

    try {
      // Find user by username
      const errors = validationResult(req);
      if (mobilenumber) {
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, errors: errors.array() });
        }
      }

      let user;
      if (google_signin) {
        user = await User.findOne(
          mobilenumber ? { mobilenumber } : { email }
        );
        res
        .status(200)
        .json({
          success: true,
          userId: user._id,
          UserType: user.UserType,
        });
      } else {
        user = await User.findOne(
          mobilenumber ? { mobilenumber } : { email }
        );
  
        // Check if user exists
        if (!user) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
        }
        console.log(!user.verified  , user.UserType === "3");
        // Check if user exists
        if (user.verified && user.UserType === "3") {
          return res
          .status(200)
          .json({
            success: true,
            userId: user._id,
            UserType: user.UserType,
          });
        }

        if(user.UserType === "1" && fcm_token){
          user.fcm_token = fcm_token;
          // Save the updated Product
          const updateduser = await user.save();
        }
  
        // Check password
        if (!mobilenumber) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res
              .status(401)
              .json({ success: false, message: "Invalid credentials" });
          }
        }
  
        // Generate JWT token
        const token = jwt.sign(
          { email: user.email, userId: user._id, UserType: user.UserType },
          "your-secret-key",
          { expiresIn: "1h" }
        );
  
        res
          .status(200)
          .json({
            success: true,
            userId: user._id,
            UserType: user.UserType,
          });
      }
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
  
   register:   async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
  
      const {
        firstname,
        lastname,
        email,
        password,
        mobilenumber,
        UserType,
        lang,
        companyName,
        numberOfEmployees,
        google_signin,
        howYouHeard,
        roleInHiring
      } = req.body;
  
      console.log({
        firstname,
        lastname,
        email,
        password,
        mobilenumber,
        UserType,
        lang,
        google_signin
      });
  
      const emailTaken = await isFieldTaken("email", email, RESPONSE_MESSAGES.EMAIL_TAKEN);
      if (emailTaken) return res.status(400).json(emailTaken);
  
      const mobileTaken = await isFieldTaken("mobilenumber", mobilenumber, RESPONSE_MESSAGES.MOBILE_TAKEN);
      if (mobileTaken) return res.status(400).json(mobileTaken);
  
    
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateVerificationCode();
      const otpExpiry = Date.now() + 3600000; // OTP expires in 1 hour
  
      const newUser = await User.create({
        firstname,
        lastname,
        UserType,
        mobilenumber,
        email,
        password: hashedPassword,
        username: firstname,
        lang,
        OTPNumber: otp,
        OTPExpiry: otpExpiry,
        verified: true,
        howYouHeard,
        numberOfEmployees,
        companyName,
        roleInHiring
      });
  
      if (google_signin) {
        return res.status(200).json({
          success: true,
          user: newUser,
          userId: newUser._id,
          UserType: newUser.UserType,
        });
      }
  
      let newAdmin = null;
      if (UserType === "2") {
        newAdmin = await Admin.create({
          since: req.body.since,
          team_size: req.body.team_size,
          admin_id: newUser._id,
          category_type: req.body.category_type,
          allow: req.body.allow,
          about: req.body.about,
          facebook: req.body.facebook,
          twitter: req.body.twitter,
          linkedin: req.body.linkedin,
          google: req.body.google,
          country: req.body.country,
          city: req.body.city,
          address: req.body.address,
          lat: req.body.lat,
          log: req.body.log,
        });
      }
  
      await sendEmail(email, otp);
  
      const response = {
        success: true,
        user: newUser,
        userId: newUser._id,
        UserType: newUser.UserType,
        ...(newAdmin && { admin: newAdmin })
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: RESPONSE_MESSAGES.SERVER_ERROR });
    }
  },
  
  listUsers: async (req, res) => {
    try {
      // Fetch all users
      const users = await User.find();
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  getUsers: async (req, res) => {
    try {
      // Extract usertype and lang from query parameters
      const { UserType, lang } = req.query;

      // Construct the filter object based on provided parameters
      const filter = {};
      if (UserType) filter.UserType = UserType;
      if (lang) filter.lang = lang;

      // Fetch users based on the filter
      const users = await User.find(filter);

      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Generate a unique reset token
      const resetToken = generateToken();

      // Save the reset token and its expiration time in the user document
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();

      // Send reset email
      await sendResetEmail(user.email, resetToken);

      res
        .status(200)
        .json({ success: true, message: "Password reset email sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  listAdmins: async (req, res) => {
    try {
      const admins = await Admin.find();
      res.status(200).json({ success: true, admins });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
  requestUser: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { mobilenumber } = req.body;
      const user = await User.findOne({ mobilenumber });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Send verification code via Twilio SMS
      // const updateOTP = await sendVerificationSMS(`${user.mobilenumber}`);
      // Save the OTP in the user document
      user.OTPNumber = 1234;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "Verification SMS sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, mobilenumber, otp } = req.body;
      const user = await User.findOne(
        mobilenumber ? { mobilenumber } : { email }
      );

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (user.OTPNumber !== Number(otp)) {
        return res.status(401).json({ success: false, message: "Invalid OTP" });
      }

      // Reset the OTP after successful verification
      user.OTPNumber = null;
      user.verified = true;
      await user.save();

      return res
        .status(200)
        .json({
          success: true,
          message: "OTP verified successfully",
          userId: user._id,
          UserType: user.UserType,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
  AdminsListDes: async (req, res) => {
    try {
      const admins = await Admin.find();

      var adminsWithData = await Promise.all(
        admins.map(async (admin) => {
          const userData = await User.findById(admin.admin_id);
          admin["admin_id"] = userData;
          console.log(userData);
          return admin;
        })
      );

      res.status(200).json({ success: true, admins: adminsWithData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const adminId = req.params.id;

      // Check if the admin with the given ID exists
      const adminToDelete = await Admin.findById(adminId);

      if (!adminToDelete) {
        return res
          .status(404)
          .json({ success: false, error: "Admin not found" });
      }

      // Check if the associated user with the given ID exists
      const userToDelete = await User.findById(adminToDelete.admin_id);

      if (!userToDelete) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // Delete the admin and associated user
      await Admin.deleteOne({ _id: adminId });
      await User.deleteOne({ _id: adminToDelete.admin_id });

      res.status(200).json({
        success: true,
        message: "Admin and associated user deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const adminId = req.params.id;

      // Check if the admin with the given ID exists
      const adminToDelete = await User.findById(adminId);

      if (!adminToDelete) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // Delete the admin and associated user
      await User.deleteOne({ _id: adminId });

      res.status(200).json({
        success: true,
        message: "User and associated user deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
  userGetById: async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Check if the user with the given ID exists
      const userData = await User.findById(userId);
  
      if (!userData) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
  
      // Check if the user's account is verified
      if (!userData.verified) {
        return res.status(401).json({ success: false, message: "Account not verified" });
      }
  
      let adminValues = null;
      let jobPostCount = 0;
      let jobApplicationTotal = 0;
      let jobShortListTotal = 0;
  
      if (userData.UserType === "2") {
        adminValues = await Companys.findById(userData.admin_id);
  
        if (!adminValues) {
          return res.status(404).json({ success: false, error: "Admin data not found" });
        }
  
        // Fetch JobPost count, AddCart items, and ShortList totals in parallel
        const [jobPostTotal, addCarts, shortListTotal] = await Promise.all([
          JobPost.countDocuments({ company_id: adminValues._id }),
          AddCart.aggregate([
            {
              $lookup: {
                from: 'jobposts', // collection name in the database
                localField: 'productId',
                foreignField: '_id',
                as: 'productDetails'
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
              }
            },
            {
              $unwind: '$productDetails'
            },
            {
              $match: {
                'productDetails.company_id': userId
              }
            },
            {
              $unwind: '$userDetails'
            }
          ]),
          AddCart.countDocuments({ status: "Approved", companyId: adminValues._id })
        ]);
  
        jobPostCount = jobPostTotal;
        jobApplicationTotal = addCarts.length;
        jobShortListTotal = shortListTotal;
  
        // Add admin values and counts to user data
        userData._doc.admin_values = adminValues;
        userData._doc.JobPost_total = jobPostCount;
        userData._doc.JobMessage_total = 0; // You can update this if you have a way to get JobMessage count
        userData._doc.JobShortList_total = jobShortListTotal;
        userData._doc.JobApplication_total = jobApplicationTotal;
      }
  
      // Respond with user data
      res.status(200).json({ success: true, User: userData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
  
  
  updateAdmin: async (req, res) => {
    try {
      const adminId = req.params.id;
      const updateData = req.body;

      const userToUpdate = await User.findById(adminId);

      if (!userToUpdate) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      if (userToUpdate.UserType === "2") {
        const updatedAdmin = await updateAdmin(adminId, updateData);

        if (!updatedAdmin) {
          return res
            .status(404)
            .json({ success: false, error: "Admin not found" });
        }

        const updatedUser = await updateUser(adminId, updateData);

        const response = {
          success: true,
          user: updatedUser,
        };

        if (updatedAdmin) {
          response.admin = updatedAdmin;
        }

        res.status(200).json(response);
      } else {
        const updatedUser = await updateUser(adminId, updateData);
        res.status(200).json({ success: true, user: updatedUser });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  updateUsers: async (req, res) => {
    try {
      const UserId = req.params.id;
      const updateData = req.body;

      const userToUpdate = await User.findById(UserId);

      if (!userToUpdate) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      if (userToUpdate.UserType === "2") {
        const updatedAdmin = await updateAdmin(UserId, updateData);

        if (!updatedAdmin) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        const updatedUser = await updateUser(UserId, updateData);

        const response = {
          success: true,
          user: updatedUser,
        };

        if (updatedAdmin) {
          response.admin = updatedAdmin;
        }

        res.status(200).json(response);
      } else {
        const updatedUser = await updateUser(UserId, updateData);
        res.status(200).json({ success: true, user: updatedUser });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
   userImageGetById: async (req, res) => {
    try {
      const userId = req.params.id;
      const updateFields = req.body;
  
      // Check if the user with the given ID exists
      const userData = await User.findById(userId);
      if (!userData) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
  
      // Update the fields dynamically
      Object.keys(updateFields).forEach((field) => {
        if (updateFields[field] !== undefined && updateFields[field] !== null) {
          userData[field] = updateFields[field];
        }
      });
  
      // Save the updated user
      await userData.save();
  
      let newAdmin = null;
      if (userData.UserType === "2") {
        // Fetch the admin details using admin_id from userData
        const adminData = await Companys.findById(userData._id);
        console.log(adminData);
        
  
        if (adminData) {
          // Update admin data fields
          Object.keys(updateFields).forEach((field) => {
            if (updateFields[field] !== undefined && updateFields[field] !== null) {
              adminData[field] = updateFields[field];
            }
          });
  
          // Save the updated admin data
          await adminData.save();
  
          newAdmin = {
            since: adminData.since,
            team_size: adminData.team_size,
            admin_id: adminData.admin_id,
            category_type: adminData.category_type,
            allow: adminData.allow,
            about: adminData.about,
            facebook: adminData.facebook,
            twitter: adminData.twitter,
            linkedin: adminData.linkedin,
            google: adminData.google,
            country: adminData.country,
            city: adminData.city,
            address: adminData.address,
            lat: adminData.lat,
            log: adminData.log,
          };
        } else {
          return res.status(404).json({ success: false, error: "Admin not found" });
        }
      }
  
      res.status(200).json({
        success: true,
        user: userData,
        admin: newAdmin, // Including the newAdmin object in the response if UserType is 2
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
  

  verifyEmailOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (user.OTPNumber !== otp || user.OTPExpiry < Date.now()) {
        return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
      }
  
      // Reset the OTP and mark the user as verified
      user.OTPNumber = null;
      user.OTPExpiry = null;
      user.verified = true;
      await user.save();
  
      res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
  
};