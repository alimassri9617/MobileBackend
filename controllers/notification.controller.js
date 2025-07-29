// controllers/notification.controller.js
import Notification from "../models/notification.model.js";

// GET /api/notifications
export const listNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("sender", "firstName lastName profilePic");
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load notifications" });
  }
};

// PATCH /api/notifications/markRead
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark all read" });
  }
};

// PATCH /api/notifications/:id/read
export const markOneRead = async (req, res) => {
  try {
    const note = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Not found" });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark read" });
  }
};
