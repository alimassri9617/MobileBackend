// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },   // ← new
  type:    { type: String, required: true },
  message: { type: String, required: true },
  data:    { type: mongoose.Schema.Types.Mixed },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);