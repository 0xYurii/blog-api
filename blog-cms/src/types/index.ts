// Type definitions for the blog CMS

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title: string;
  content: string;
}
