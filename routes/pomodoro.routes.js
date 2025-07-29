import express from "express";
import { recordSession, getStats } from "../controllers/pomodoro.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/session", protectRoute, recordSession);
router.get("/stats", protectRoute, getStats);
export default router;
