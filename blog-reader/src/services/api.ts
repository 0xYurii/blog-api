// API service for blog-reader

import type { Post, Comment, CreateCommentData } from '../types';

const API_URL = 'http://localhost:3000/api';

/**
 * Fetch all published posts
 */
export const getPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_URL}/posts`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return response.json();
};

/**
 * Fetch a single post by ID
 */
export const getPost = async (id: number): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return response.json();
};

/**
 * Fetch all comments for a post
 */
export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  
  return response.json();
};

/**
 * Create a new comment on a post
 * Supports both anonymous and authenticated users
 */
export const createComment = async (
  postId: number,
  data: CreateCommentData
): Promise<Comment> => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create comment');
  }
  
  return response.json();
};
