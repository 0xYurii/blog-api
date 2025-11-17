// Type definitions for blog-reader
export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  user: {
    username: string;
  };
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: number;
  content: string;
  username: string | null;
  email: string | null;
  userId: number | null;
  postId: number;
  createdAt: string;
  user?: {
    username: string;
  } | null;
}

export interface CreateCommentData {
  content: string;
  username?: string;
  email?: string;
}
