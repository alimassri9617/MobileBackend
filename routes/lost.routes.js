import express from "express";
import {
  createLostAndFoundItem,
  getLostAndFoundItems,
  getLostAndFoundItem,
  updateResolvedStatus,
  deleteLostAndFoundItem,
  sendNotificationToPoster,
} from "../controllers/lostitem.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../utils/multerconfig.js";
const router = express.Router();

router.post("/", protectRoute, upload.single("image"), createLostAndFoundItem);

router.get("/", protectRoute, getLostAndFoundItems);

router.get("/:id", protectRoute, getLostAndFoundItem);

router.patch("/:id/resolve", protectRoute, updateResolvedStatus);

router.post("/:id/notify", protectRoute, sendNotificationToPoster);

router.delete("/:id", protectRoute, deleteLostAndFoundItem);

export default router;
