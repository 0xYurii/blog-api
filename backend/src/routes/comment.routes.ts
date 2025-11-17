import { Router } from "express";
import {
  getPostComments,
  createComment,
  deleteComment,
} from "../controllers/comment.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth.middleware";

const router = Router();

// Comment routes
router.get("/posts/:postId/comments", getPostComments);
router.post("/posts/:postId/comments", optionalAuth, createComment); // Optional auth for logged-in users
router.delete("/comments/:id", authenticateToken, deleteComment);

export default router;
