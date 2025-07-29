import express from "express";
import Todo from "../models/todo.model.js";

const router = express.Router();

// Get todos for logged-in user
export const getTodoList = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new todo
export const postTodo = async (req, res) => {
  const { title, description, date, startTime, endTime, completed, priority } =
    req.body;

  // Validate required fields
  if (!title || !date || !priority) {
    return res
      .status(400)
      .json({ message: "Title, date, and priority are required." });
  }

  // Ensure priority has a valid value
  if (!["Top", "Moderate", "Low"].includes(priority)) {
    return res.status(400).json({ message: "Invalid priority value." });
  }

  try {
    const newTodo = new Todo({
      title,
      description: description || "",
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      completed: completed ?? false,
      priority,
      userId: req.user._id,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again." });
  }
};

// Update an existing todo
export const updateTodo = async (req, res) => {
  try {
    const allowedUpdates = [
      "title",
      "description",
      "date",
      "startTime",
      "endTime",
      "completed",
      "priority",
    ];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid update fields." });
    }

    if (
      req.body.priority &&
      !["Top", "Moderate", "Low"].includes(req.body.priority)
    ) {
      return res.status(400).json({ message: "Invalid priority value." });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    updates.forEach((update) => {
      todo[update] = req.body[update];
    });

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    res.json({ message: "Deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
