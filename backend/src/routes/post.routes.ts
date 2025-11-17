import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  togglePublish,
} from "../controllers/post.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getSinglePost);

// Protected routes
router.post("/", authenticateToken, createPost);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);
router.patch("/:id/publish", authenticateToken, togglePublish);

export default router;
