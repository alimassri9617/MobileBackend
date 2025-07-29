import express from "express";
import {
  createAnnouncement,
  getAnnouncementsForStudent,
  getTeacherAnnouncements,
  deleteAnnouncement,
  getAllAnnouncements, 
} from "../controllers/announcement.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import restrictTo from "../middleware/RoleRestriction.js";
const router = express.Router();
import { Subjects, Majors } from "../models/Constants.js";
// Create a new announcement - only teachers can create announcements
router.post("/", protectRoute, restrictTo("teacher","admin"), createAnnouncement);

// Get announcements relevant to the logged-in student
router.get(
  "/student",
  protectRoute,
  restrictTo("student"),
  getAnnouncementsForStudent
);

// Get all announcements created by a teacher
router.get(
  "/teacher",
  protectRoute,
  restrictTo("teacher"),
  getTeacherAnnouncements
);

router.get(
  "/admin",
  protectRoute,
  restrictTo("admin"),
  getAllAnnouncements
);

// Delete an announcement
router.delete("/:id", protectRoute, restrictTo("teacher"), deleteAnnouncement);

router.get("/majors", (req, res) => {
  res.json(Majors);
});

// GET /api/subjects - Return the list of subjects
router.get("/subjects", (req, res) => {
  res.json(Subjects);
});
export default router;
