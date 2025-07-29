//user.routes.js
import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsers,getUserById,updateProfilePic } from "../controllers/user.controller.js";
import upload from "../utils/multerconfig.js";
const router = express.Router();

router.get("/", protectRoute, getUsers); //api/users









router.get("/:id",protectRoute, getUserById);

// PATCH /api/users/:id/profile-pic
router.patch("/:id/profile-pic",protectRoute, upload.single("avatar"), updateProfilePic);
export default router;
