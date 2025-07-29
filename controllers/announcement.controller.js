import Announcement from "../models/announcement.model.js";
import { Student } from "../models/user.model.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";
import notificationService from "../utils/NotificationService.js";

export const createAnnouncement = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const {
      title,
      content,
      category,
      announcementType,
      targetMajor,
      targetSubject,
    } = req.body;

    // 1. Validate required fields
    if (!title || !content || !category || !announcementType) {
      return res.status(400).json({
        message: "Title, content, category, and announcementType are required.",
      });
    }

    // 2. Conditional target validation
    if (announcementType === "major" && !targetMajor) {
      return res.status(400).json({
        message: "Target major is required for major announcements.",
      });
    }
    if (announcementType === "subject" && !targetSubject) {
      return res.status(400).json({
        message: "Target subject is required for subject announcements.",
      });
    }

    // 3. Save the announcement
    const newAnnouncement = await new Announcement({
      title,
      content,
      sender: req.user._id,
      category,
      announcementType,
      targetMajor,
      targetSubject,
    }).save();

    // 4. Determine recipient IDs
    let recipients = [];
    if (announcementType === "major") {
      const students = await Student.find({ major: targetMajor }).select("_id");
      recipients = students.map(s => s._id.toString());
    } else if (announcementType === "subject") {
      const students = await Student
        .find({ "schedule.subject": targetSubject })
        .select("_id");
      recipients = students.map(s => s._id.toString());
    }

    // 5. Send notifications via the shared service
    await notificationService.notifyUsers({
      recipients,
      sender: req.user._id,
      type: "announcement",
      message: `[${category}] ${title}`,
      data: {
        announcementId: newAnnouncement._id,
        title,
        content,
        category,
        announcementType,
        targetMajor,
        targetSubject,
        createdAt: newAnnouncement.createdAt,
        type: "Announcements",
      },
    });

    // 6. Respond to client
    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create announcement",
      error: error.message,
    });
  }
};



// Get all announcements relevant to a specific student
export const getAnnouncementsForStudent = async (req, res) => {
  try {
    const studentId = req.user._id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentSubjects = student.schedule.map((item) => item.subject);

    const announcements = await Announcement.find({
      $or: [
        { announcementType: "major", targetMajor: student.major },
        { announcementType: "subject", targetSubject: { $in: studentSubjects } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "firstName lastName profilePic Department title"
      );

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements for student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};

// Get all announcements created by a teacher
export const getTeacherAnnouncements = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const announcements = await Announcement.find({ sender: teacherId })
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "firstName lastName profilePic Department title"
      );

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching teacher announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher announcements",
      error: error.message,
    });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (announcement.sender.toString() !== req.user._id) {
      return res.status(403).json({ message: "Not authorized to delete this announcement" });
    }

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};

// Get all announcements (admin)
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "firstName lastName profilePic Department title"
      );

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching all announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};
