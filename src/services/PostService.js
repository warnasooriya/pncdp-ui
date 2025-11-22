
import axios from "../api/axios";
 
 
// Post creation
export const createPost = async (postData) => {
  try {
    const response = await axios.post('/api/candidate/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get feed posts with pagination
export const getFeedPosts = async (pagination) => {
  try {
    const response = await axios.get(`/api/candidate/posts/feed?page=${pagination.page}&limit=${pagination.limit}&userId=${pagination.userId}&sortBy=${pagination.sortBy}`);
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
    const response = await axios.post(`/api/candidate/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Add comment to a post
export const addComment = async (postId, commentData) => {
  try {
    const response = await axios.post(`/api/candidate/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for a post
export const getPostComments = async (postId) => {
  try {
    const response = await axios.get(`/api/candidate/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Share a post
export const sharePost = async (postId, shareData) => {
  try {
    const response = await axios.post(`/api/candidate/posts/${postId}/share`, shareData);
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