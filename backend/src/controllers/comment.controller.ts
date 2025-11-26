import { Request, Response } from "express";
import prisma from "../db";

import { asyncHandler } from "../utils/asyncHandler";

// Get all comments for a specific post (PUBLIC)
export const getPostComments = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const postIdNum = parseInt(postId!);
    if (isNaN(postIdNum)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postIdNum },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Get comments
    const comments = await prisma.comment.findMany({
      where: { postId: postIdNum },
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(comments);
  },
);

// Create comment (ANONYMOUS OR AUTHENTICATED)
export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content, username, email, authorName, authorEmail } = req.body;
    const userId = req.userId; // May be undefined if not authenticated

    // Support both 'username'/'email' and 'authorName'/'authorEmail' field names
    const finalUsername = username || authorName;
    const finalEmail = email || authorEmail;

    console.log("Create comment request:", {
      postId,
      content,
      username: finalUsername,
      email: finalEmail,
      userId,
    });

    const postIdNum = parseInt(postId!);
    if (isNaN(postIdNum)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postIdNum },
    });

    if (!post) {
      console.log("Post not found:", postIdNum);
      return res.status(404).json({ error: "Post not found" });
    }

    // Validate: either authenticated OR provide username/email
    if (!userId && (!finalUsername || !finalEmail)) {
      console.log("Validation failed - no userId and missing username/email");
      return res.status(400).json({
        error: "Must be logged in or provide username and email",
      });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: postIdNum,
        userId: userId || null,
        username: !userId ? finalUsername : null,
        email: !userId ? finalEmail : null,
      },
      include: {
        user: userId ? { select: { username: true } } : false,
      },
    });

    console.log("Comment created successfully:", comment.id);
    res.status(201).json(comment);
  },
);

// Delete comment (AUTHENTICATED - author or post owner)
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;

    const commentId = parseInt(id!);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: { select: { authorId: true } } },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check authorization: user owns comment OR user owns the post
    const isCommentAuthor = comment.userId && comment.userId === userId;
    const isPostAuthor = comment.post.authorId === userId;

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
    res.json({ message: "Comment deleted successfully" });
  },
);
