import { Request, Response } from "express";
import prisma from "../db";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const authorId = req.userId!; // From auth middleware

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Only return published posts for public
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const postId = parseInt(id!);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: { username: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId!;

    const postId = parseInt(id!);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (userId !== post.authorId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const postId = parseInt(id!);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (userId !== post.authorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

export const togglePublish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const postId = parseInt(id!);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const publishedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, published: true },
    });

    if (!publishedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (userId !== publishedPost.authorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { published: !publishedPost.published },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle publish status" });
  }
};
