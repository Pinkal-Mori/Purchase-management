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
  password: { type: String, required: true },
  profileImage: String,
  customWebsiteBuckets: [BucketSchema]
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
