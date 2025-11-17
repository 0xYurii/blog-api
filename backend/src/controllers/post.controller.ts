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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Transform response to match frontend expectations
    const response = {
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      authorId: post.authorId,
      createdAt: post.createdAt,
      author: post.user,
      _count: post._count,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // From auth middleware (if authenticated)

    // If authenticated, return all posts; otherwise only published
    const posts = await prisma.post.findMany({
      where: userId ? {} : { published: true },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform response to match frontend expectations
    const response = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      authorId: post.authorId,
      createdAt: post.createdAt,
      author: post.user,
      _count: post._count,
    }));

    res.json(response);
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
              select: { 
                id: true,
                username: true 
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Transform response to match frontend expectations
    const response = {
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      authorId: post.authorId,
      createdAt: post.createdAt,
      author: post.user,
      comments: post.comments,
      _count: post._count,
    };

    res.json(response);
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Transform response to match frontend expectations
    const response = {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      published: updatedPost.published,
      authorId: updatedPost.authorId,
      createdAt: updatedPost.createdAt,
      author: updatedPost.user,
      _count: updatedPost._count,
    };

    res.json(response);
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

    console.log("Toggle publish - userId from token:", userId);

    const postId = parseInt(id!);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const publishedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, published: true },
    });

    console.log("Toggle publish - post authorId:", publishedPost?.authorId);

    if (!publishedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (userId !== publishedPost.authorId) {
      console.log("Authorization failed - userId:", userId, "authorId:", publishedPost.authorId);
      return res.status(403).json({ 
        error: "Not authorized",
        message: `User ${userId} is not authorized to modify post owned by ${publishedPost.authorId}`
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { published: !publishedPost.published },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Transform response to match frontend expectations
    const response = {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      published: updatedPost.published,
      authorId: updatedPost.authorId,
      createdAt: updatedPost.createdAt,
      author: updatedPost.user,
      _count: updatedPost._count,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle publish status" });
  }
};
