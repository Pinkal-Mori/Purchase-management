import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  subcategories: { type: [String], default: [] },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;