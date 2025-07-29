import express from "express";
const router = express.Router();
import {
  getBuildingInfo,
  getFloors,
  getFloorDetails,
} from "../controllers/chatbot.controller.js";
import protectRoute from "../middleware/protectRoute.js";
router.post("/ask",protectRoute, getBuildingInfo);
router.get("/floors",protectRoute, getFloors);
router.get("/floor/:floor",protectRoute, getFloorDetails);

export default router;
