// controllers/lostAndFoundController.js
import LostAndFoundItem from "../models/lostitem.model.js";
import { User } from "../models/user.model.js"; // Adjust path if needed
import notificationService from "../utils/NotificationService.js";
// Create a new Lost and Found item
export const createLostAndFoundItem = async (req, res) => {
  try {
    const { title, description, category, location, phoneNumber, type } =
      req.body;

    const postedBy = req.user._id;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category ||
      !location?.trim() ||
      !phoneNumber?.trim() ||
      !type
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    if (!["lost", "found"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Type must be either 'lost' or 'found'." });
    }

    // File from Multer/Cloudinary
    const image =req.file?.path ||"";
    console.log(req.file ? req.file.path : "No image uploaded");

    const newItem = new LostAndFoundItem({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      phoneNumber: phoneNumber.trim(),
      image,
      type,
      postedBy,
    });

    const savedItem = await newItem.save();
    await savedItem.populate("postedBy", "firstName lastName profilePic");

    res.status(201).json(savedItem);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all Lost and Found items
export const getLostAndFoundItems = async (req, res) => {
  try {
    // Optional query parameters: type, category, resolved, page, limit
    const filter = {};
    if (req.query.type && ["lost", "found"].includes(req.query.type)) {
      filter.type = req.query.type;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.resolved === "true" || req.query.resolved === "false") {
      filter.resolved = req.query.resolved === "true";
    }

    // Pagination defaults
    const page =
      parseInt(req.query.page, 10) >= 1 ? parseInt(req.query.page, 10) : 1;
    const limit =
      parseInt(req.query.limit, 10) >= 1 ? parseInt(req.query.limit, 10) : 10;

    const items = await LostAndFoundItem.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("postedBy", "firstName lastName profilePic");

    const totalCount = await LostAndFoundItem.countDocuments(filter);

    res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Lost and Found item by ID
export const getLostAndFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LostAndFoundItem.findById(id).populate(
      "postedBy",
      "firstName lastName profilePic"
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    // If invalid ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update the resolved status of an item
export const updateResolvedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved } = req.body;
    const userId = req.user._id;

    // Ensure `resolved` is a boolean
    if (typeof resolved !== "boolean") {
      return res
        .status(400)
        .json({ message: "Resolved must be a boolean value." });
    }

    const item = await LostAndFoundItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.postedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this item." });
    }

    item.resolved = resolved;
    await item.save();

    // Repopulate the user before sending
    await item.populate("postedBy", "firstName lastName profilePic");

    res.status(200).json(item);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    res.status(500).json({ message: error.message });
  }
};



// Delete a Lost and Found item
export const deleteLostAndFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ✅ fixed

    const item = await LostAndFoundItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.postedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this item." });
    }

    await LostAndFoundItem.deleteOne({ _id: id });
    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    res.status(500).json({ message: error.message });
  }
};


// New controller function to send notification to poster
export const sendNotificationToPoster = async (req, res) => {
  try {
    const { id } = req.params; // item ID
    const senderId = req.user._id;
    const { message } = req.body;

    const item = await LostAndFoundItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const recipientId = item.postedBy.toString();

    await notificationService.notifyUsers({
      recipients: [recipientId],
      sender: senderId,
      type: "lostfound",
      message: message || "This is my item",
      data: { itemId: item._id, type: "Lost & Found" },
    });

    res.status(200).json({ message: "Notification sent to item poster." });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    res.status(500).json({ message: error.message });
  }
};
