import { User } from "../models/user.model.js"; // Note the .js extension

export const getUserSchedule = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and select only the schedule field
    const user = await User.findById(userId).select("schedule");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
