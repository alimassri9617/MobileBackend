import mongoose from "mongoose";
import { Majors, Subjects } from "./Constants.js";
const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type:String, 
    enum :["Exam", "Makeup Session", "Event" ,"Other"], 
    required: true
  },
  announcementType: {
    type: String,
    enum: ["major", "subject"],
    required: true,
  },
  targetMajor: {
    type: String,
    enum: Majors,
    required: function () {
      return this.announcementType === "major";
    },
  },
  targetSubject: {
    type: String,
    enum: Subjects,
    required: function () {
      return this.announcementType === "subject";
    },
  },
  createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;
