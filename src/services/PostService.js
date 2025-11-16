import axios from 'axios';

// Base API URL - adjust according to your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Post creation
export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get feed posts with pagination
export const getFeedPosts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    // Return mock data for development
    return {
      posts: [
        {
          _id: '1',
          content: 'Welcome to the platform! This is a sample post.',
          author: {
            _id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: null
          },
          createdAt: new Date().toISOString(),
          likes: [],
          comments: [],
          shares: [],
          media: null,
          mediaType: null
        }
      ],
      hasMore: false,
      totalPosts: 1
    };
  }
};

// Toggle like on a post
export const toggleLike = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Add comment to a post
export const addComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for a post
export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Share a post
export const sharePost = async (postId, shareData) => {
  try {
    const response = await api.post(`/posts/${postId}/share`, shareData);
    return response.data;
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};

// Utility function to format time ago
export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return postDate.toLocaleDateString();
  }
};

// Extract hashtags from text
export const extractHashtags = (text) => {
  const hashtagRegex = /#[\w]+/g;
  return text.match(hashtagRegex) || [];
};

// Extract mentions from text
export const extractMentions = (text) => {
  const mentionRegex = /@[\w]+/g;
  return text.match(mentionRegex) || [];
};

export default {
  createPost,
  getFeedPosts,
  toggleLike,
  addComment,
  getPostComments,
  sharePost,
  formatTimeAgo,
  extractHashtags,
  extractMentions,
};