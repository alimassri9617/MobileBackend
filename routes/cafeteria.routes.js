import express from "express";
import {
  getMenuByDay,
  createMenuForDay,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/cafereriaMenu.controller.js";

import  protectRoute from "../middleware/protectRoute.js";
import  restrictTo from "../middleware/RoleRestriction.js";

const router = express.Router();
router.use(protectRoute)
// Public route
router.get("/:day", getMenuByDay);

// Admin-only routes
router.post("/",restrictTo("admin"), createMenuForDay);
router.post("/:day/:category", restrictTo("admin"), addMenuItem);
router.put("/:day/:category/:itemId", restrictTo("admin"), updateMenuItem);
router.delete("/:day/:category/:itemId",restrictTo("admin"), deleteMenuItem);

export default router;
