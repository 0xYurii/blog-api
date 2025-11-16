import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getSinglePost,
} from "../controllers/post.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.post("/", authenticateToken, createPost); // Protected route!

export default router;
