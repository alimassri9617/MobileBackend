import express from "express";
import {
  getMessages,
  sendMessage,
  markMessagesRead,
  getConversationsWithUnreadCount,
  getDeviceToken,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.get("/", protectRoute, getConversationsWithUnreadCount);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/read/:id", protectRoute, markMessagesRead);
router.post("/token", getDeviceToken);
export default router;
