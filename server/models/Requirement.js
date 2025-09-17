import mongoose from "mongoose";

const RequirementSchema = new mongoose.Schema({
  part: {
    type: String,
    required: [true, "Part name is required"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"]
  },
  note: {
    type: String,
    required: [true, "Note is required"],
    trim: true,
  },
  reason: {
    type: String,
    trim: true,
    default: ""
  },
  refLinkText: {
    type: String,
    trim: true,
    default: "N/A"
  },
  refLinkUrl: {
    type: String,
    trim: true,
    required: [true, "refLink is required"],
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\/.+/i.test(v);  // allow empty or valid URL
      },
      message: props => `${props.value} is not a valid URL`
    },
    default: ""
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0]  // YYYY-MM-DD
  },
  addedBy: {
    type: String,
    trim: true,
    default: "Unknown"
  },
  orderId: {
    type: String,
    trim: true,
    default: ""
  },
  orderedBy: {
    type: String,
    trim: true,
    default: ""
  },
  amount: {   // 🆕 New field
    type: Number,
    default: 0,
    min: [0, "Amount cannot be negative"]
  },
  completed: {
    type: Boolean,
    default: false
  },
  views: [
    {
      userId: { type: String },
      viewed: { type: Boolean, default: false }
    }
  ]
},{
  timestamps: true  // adds createdAt and updatedAt
});

export const Requirement = mongoose.model("Requirement", RequirementSchema);
