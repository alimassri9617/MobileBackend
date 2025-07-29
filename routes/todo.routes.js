import express from "express";
import {
  getTodoList,
  postTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();
router.get("/", protectRoute, getTodoList);
router.post("/", protectRoute, postTodo);
router.put("/:id", protectRoute, updateTodo);
router.delete("/:id", protectRoute, deleteTodo);

export default router;
