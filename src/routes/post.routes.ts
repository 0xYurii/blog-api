import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
} from "../controllers/post.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.put("/:id", authenticateToken, updatePost); // Protected route!
router.post("/", authenticateToken, createPost); // Protected route!

export default router;
