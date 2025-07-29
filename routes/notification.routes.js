import express from "express";
import {
  listNotifications,
  markAllRead,
  markOneRead,
} from "../controllers/notification.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();
router.use(protectRoute);

router.get("/", listNotifications);
router.patch("/markRead", markAllRead);
router.patch("/:id/read", markOneRead);

export default router;
