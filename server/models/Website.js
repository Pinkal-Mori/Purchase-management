import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // જે યુઝરે વેબસાઈટ બનાવી છે તેનો ID
}, { timestamps: true });

export const Website = mongoose.model("Website", websiteSchema);