// Type definitions for the blog API

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: number;
  content: string;
  authorName: string | null;
  authorEmail: string | null;
  postId: number;
  userId: number | null;
  createdAt: string;
  user?: {
    id: number;
    username: string;
  };
}

export interface CreateCommentData {
  content: string;
  authorName?: string;
  authorEmail?: string;
}
