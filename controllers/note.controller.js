// controllers/note.controller.js
import Note from "../models/note.model.js";

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned, color } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required." });
    }

    if (tags && !Array.isArray(tags)) {
      return res
        .status(400)
        .json({ success: false, message: "Tags must be an array." });
    }

    const allowedColors = [
      "default",
      "red",
      "green",
      "blue",
      "yellow",
      "purple",
    ];
    if (color && !allowedColors.includes(color)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid color value." });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      tags,
      isPinned,
      color,
    });

    return res.status(201).json({ success: true, note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
// Get all notes for the logged-in user (pinning first, then most recently updated)
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      isPinned: -1,
      updatedAt: -1,
    });
    return res.status(200).json({ success: true, notes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single note by its ID (only if it belongs to the logged-in user)
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    return res.status(200).json({ success: true, note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const allowedUpdates = ["title", "content", "tags", "isPinned", "color"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (key in req.body) updates[key] = req.body[key];
    }

    if (updates.tags && !Array.isArray(updates.tags)) {
      return res
        .status(400)
        .json({ success: false, message: "Tags must be an array." });
    }

    const allowedColors = [
      "default",
      "red",
      "green",
      "blue",
      "yellow",
      "purple",
    ];
    if (updates.color && !allowedColors.includes(updates.color)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid color value." });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    return res.status(200).json({ success: true, note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    return res.status(200).json({ success: true, message: "Note deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Query parameter is required" });
    }

    const regex = new RegExp(query.trim(), "i");
    const results = await Note.find({
      user: req.user._id,
      $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
    }).sort({ isPinned: -1, updatedAt: -1 });

    return res.status(200).json({ success: true, results });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
