// API service for blog-reader

import type { 
  Post, 
  Comment, 
  CreateCommentData,
  LoginCredentials,
  SignupCredentials,
  LoginResponse,
  User
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
 * Signup new user and store token
 */
export const signup = async (credentials: SignupCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }

  const data = await response.json();
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
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
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
};

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
