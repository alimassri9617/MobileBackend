import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
} from "../controllers/note.controller.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

router.get("/", getNotes); // GET all notes
router.get("/search", searchNotes); // GET notes matching a search query
router.post("/", createNote); // POST new note
router.get("/:id", getNoteById); // GET single note
router.put("/:id", updateNote); // UPDATE note
router.delete("/:id", deleteNote); // DELETE note

export default router;
