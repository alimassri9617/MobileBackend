import { User, Student } from "../models/user.model.js";
import { BADGES } from "../models/Constants.js";
import notificationService from "../utils/NotificationService.js";

// POST /api/pomodoro/session
export async function recordSession(req, res) {
  try {
    const userId = req.user._id; 
    const { sessionMinutes } = req.body;

    if (!sessionMinutes || sessionMinutes <= 0) {
      return res.status(400).json({ message: "Invalid sessionMinutes" });
    }

    const sessionHours = sessionMinutes / 60; // Convert minutes to hours

    // 1. Update base user stats
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.pomodoroStats.totalSessions += 1;
    user.pomodoroStats.totalHours += sessionHours; // Store hours instead of minutes
    await user.save();

    // 2. Badge logic only for students
    if (user.role === "student") {
      const student = await Student.findById(userId);
      const currentBadges = new Set(student.badges);
      const now = { timestamp: Date.now() };

      // Determine newly earned badges
      const earnedBadges = BADGES.filter((b) => {
        const already = currentBadges.has(b.id);
        if (already) return false;

        // Either threshold-based or condition-based
        if (b.threshold !== undefined) {
          // Assuming b.threshold for badges would now refer to sessions or hours as appropriate
          // If thresholds are based on sessions, no change needed.
          // If thresholds are based on hours, ensure BADGES constant reflects hours.
          return (
            user.pomodoroStats.totalSessions >= b.threshold ||
            user.pomodoroStats.totalHours >= b.threshold
          );
        }
        if (b.condition) {
          return b.condition(now);
        }
        return false;
      });

      const earned = earnedBadges.map((b) => b.id);

      if (earned.length) {
        student.badges.push(...earned);
        await student.save();

        // Send notifications for each earned badge
        for (const badge of earnedBadges) {
          await notificationService.notifyUsers({
            recipients: [userId],
            sender: process.env.SYSTEM_SENDER_ID,
            type: "pomodoro",
            message: badge.description,
            data: { badgeId: badge.id, type: "pomodoro" },
          });
        }
      }

      return res.json({
        message: "Session recorded",
        pomodoroStats: user.pomodoroStats,
        newBadges: earned,
        allBadges: student.badges,
      });
    }

    // Non-students
    return res.json({
      message: "Session recorded",
      pomodoroStats: user.pomodoroStats,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getStats(req, res) {
  try {
    const userId = req.user._id; // assuming auth middleware sets req.user

    // 1. Get base user stats
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. For students, also get badges
    if (user.role === "student") {
      const student = await Student.findById(userId);

      return res.json({
        pomodoroStats: user.pomodoroStats,
        allBadges: student.badges || [],
      });
    }

    // Non-students
    return res.json({
      pomodoroStats: user.pomodoroStats,
      allBadges: [], // or omit this field entirely
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
