import { Router } from "express";
import {
  getPostComments,
  createComment,
  deleteComment,
} from "../controllers/comment.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Comment routes
router.get("/posts/:postId/comments", getPostComments);
router.post("/posts/:postId/comments", createComment); // No auth required!
router.delete("/comments/:id", authenticateToken, deleteComment);

export default router;
