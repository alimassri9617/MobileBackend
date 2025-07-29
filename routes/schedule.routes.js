import express from "express";
import { getUserSchedule } from "../controllers/schedule.controller.js"; // Adjust path as needed
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/:id/schedule", protectRoute, getUserSchedule);

export default router;
