// API service for blog-cms with authentication

import type { 
  LoginCredentials, 
  LoginResponse, 
  Post, 
  CreatePostData, 
  UpdatePostData,
  Comment 
} from '../types';

const API_URL = 'http://localhost:3000/api';

/**
 * Get authentication headers with token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Login user and store token
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

/**
 * Logout user (clear token)
 */
export const logout = (): void => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Fetch all posts (published and unpublished)
 */
export const getPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_URL}/posts`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

/**
 * Fetch a single post by ID
 */
export const getPost = async (id: number): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
};

/**
 * Create a new post
 */
export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create post');
  }

  return response.json();
};

/**
 * Update an existing post
 */
export const updatePost = async (id: number, data: UpdatePostData): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update post');
  }

  return response.json();
};

/**
 * Delete a post
 */
export const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete post');
  }
};

/**
 * Toggle post publish status
 */
export const togglePublish = async (id: number): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts/${id}/publish`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to toggle publish status');
  }

  return response.json();
};

/**
 * Get all comments for a post
 */
export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete comment');
  }
};
