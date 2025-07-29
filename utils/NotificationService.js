// services/notificationService.js
import  Notification  from "../models/notification.model.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";
import { User } from "../models/user.model.js";

const SYSTEM_SENDER_ID = process.env.SYSTEM_SENDER_ID;  
// e.g. a special “admin” user record you seed in your DB

async function notifyUsers({
  recipients,      // array of user IDs
  sender = SYSTEM_SENDER_ID,
  type,            // e.g. "announcement" | "appointment" | "chat" | "reminder"
  message,         // string to show in UI
  data = {},       // arbitrary payload
  emitEvent = "receiveNotification",
}) {
  const io = getIO();
  const senderDetails = await User.findById(sender)
    .select("firstName profilePic")
    .lean();

  for (const userId of recipients) {
    const notif = await new Notification({
      user:      userId,
      sender,
      type,
      message,
      data,
    }).save();

    const socketId = getReceiverSocketId(userId.toString());
    if (socketId) {
      io.to(socketId).emit(emitEvent, {
        _id:       notif._id,
        user:      userId,
        sender:    senderDetails || { _id: sender },
        type,
        message,          // let the UI render it
        data:      notif.data,
        read:      notif.read,
        createdAt: notif.createdAt,
      });
    }
  }
}
export default { notifyUsers };
