// user.js
import mongoose from "mongoose";

const BucketSchema = new mongoose.Schema({
  id: String,
  title: String,
  link: String,
  image: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  profileImage: String,
  customWebsiteBuckets: [BucketSchema],
  // અહીં નવા ફીલ્ડ ઉમેરવામાં આવ્યા છે
  signup_method: { 
    type: String, 
    required: true, 
    enum: ['email', 'google'] 
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  // OTP password reset support
  resetPasswordOTP: { type: String, required: false },
  resetPasswordOTPExpiresAt: { type: Date, required: false }
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);