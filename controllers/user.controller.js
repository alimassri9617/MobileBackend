//user.controller.js

import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role; // filter by discriminator (e.g., "teacher")
    }

    const filteredUsers = await User.find(filter).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Authorize: only the user themself (or an admin) may change their pic
    if (
      req.user._id.toString() !== id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 2) Ensure file arrived
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 3) req.file.path (or secure_url) comes from your multer‑Cloudinary setup
    const newUrl = req.file.path; // adjust if your config uses `req.file.secure_url`

    // 4) Update the user document
    const user = await User.findByIdAndUpdate(
      id,
      { profilePic: newUrl },
      { new: true, select: "profilePic" }
    );

    res.json({ profilePic: user.profilePic });
  } catch (err) {
    console.error("updateProfilePic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};