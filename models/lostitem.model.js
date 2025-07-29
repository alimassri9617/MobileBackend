// models/LostAndFoundItem.js
import mongoose from "mongoose";

const LostAndFoundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Books", "Clothing", "ID Cards/Keys", "Other"],
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [
        /^\+?[0-9]{7,15}$/,
        "Please provide a valid phone number (7–15 digits, optional leading +)",
      ],
    },
    image: {
      type: String, // URL to the uploaded image
      required: false,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["lost", "found"],
      index: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resolved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Create a compound index on (type, resolved) to speed up common filters
LostAndFoundItemSchema.index({ type: 1, resolved: 1 });

const LostAndFoundItem = mongoose.model(
  "LostAndFoundItem",
  LostAndFoundItemSchema
);

export default LostAndFoundItem;
