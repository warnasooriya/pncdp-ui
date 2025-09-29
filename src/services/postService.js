import axios from '../api/axios';

// POST CRUD OPERATIONS

// Create a new post
export const createPost = async (postData) => {
  try {
    const formData = new FormData();
    formData.append('userId', postData.userId);
    formData.append('content', postData.content);
    formData.append('privacy', postData.privacy || 'public');
    
    if (postData.hashtags && postData.hashtags.length > 0) {
      formData.append('hashtags', JSON.stringify(postData.hashtags));
    }
    
    if (postData.mentions && postData.mentions.length > 0) {
      formData.append('mentions', JSON.stringify(postData.mentions));
    }
    
    if (postData.media) {
      formData.append('media', postData.media);
    }

    const response = await axios.post('/api/candidate/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get feed posts with pagination
export const getFeedPosts = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      userId,
      sortBy = 'newest',
      privacy = 'public'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      privacy
    });

    if (userId) {
      queryParams.append('userId', userId);
    }

    const response = await axios.get(`/api/candidate/posts/feed?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    throw error;
  }
};

// Get posts by user
export const getUserPosts = async (userId, params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      requestingUserId
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (requestingUserId) {
      queryParams.append('requestingUserId', requestingUserId);
    }

    const response = await axios.get(`/api/candidate/posts/user/${userId}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// Get a specific post
export const getPost = async (postId, userId = null) => {
  try {
    const queryParams = userId ? `?userId=${userId}` : '';
    const response = await axios.get(`/api/candidate/posts/${postId}${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId, postData) => {
  try {
    const formData = new FormData();
    formData.append('userId', postData.userId);
    
    if (postData.content !== undefined) {
      formData.append('content', postData.content);
    }
    
    if (postData.privacy !== undefined) {
      formData.append('privacy', postData.privacy);
    }
    
    if (postData.hashtags !== undefined) {
      formData.append('hashtags', JSON.stringify(postData.hashtags));
    }
    
    if (postData.media) {
      formData.append('media', postData.media);
    }

    const response = await axios.put(`/api/candidate/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId, userId) => {
  try {
    const response = await axios.delete(`/api/candidate/posts/${postId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// LIKE OPERATIONS

// Toggle like on a post
export const toggleLike = async (postId, userId, likeType = 'like') => {
  try {
    const response = await axios.post(`/api/candidate/posts/${postId}/like`, {
      userId,
      likeType
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Get likes for a post
export const getPostLikes = async (postId, params = {}) => {
  try {
    const { page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axios.get(`/api/candidate/posts/${postId}/likes?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post likes:', error);
    throw error;
  }
};

// COMMENT OPERATIONS

// Add a comment to a post
export const addComment = async (postId, commentData) => {
  try {
    const response = await axios.post(`/api/candidate/posts/${postId}/comments`, {
      userId: commentData.userId,
      content: commentData.content,
      parentCommentId: commentData.parentCommentId || null,
      mentions: commentData.mentions || []
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for a post
export const getPostComments = async (postId, params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'newest'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy
    });

    const response = await axios.get(`/api/candidate/posts/${postId}/comments?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    throw error;
  }
};

// Get replies for a comment
export const getCommentReplies = async (commentId, params = {}) => {
  try {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axios.get(`/api/candidate/posts/comments/${commentId}/replies?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comment replies:', error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (commentId, commentData) => {
  try {
    const response = await axios.put(`/api/candidate/posts/comments/${commentId}`, {
      userId: commentData.userId,
      content: commentData.content
    });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId, userId) => {
  try {
    const response = await axios.delete(`/api/candidate/posts/comments/${commentId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// SHARE OPERATIONS

// Share a post
export const sharePost = async (postId, shareData) => {
  try {
    const response = await axios.post(`/api/candidate/posts/${postId}/share`, {
      userId: shareData.userId,
      shareComment: shareData.shareComment || null,
      shareType: shareData.shareType || 'direct',
      privacy: shareData.privacy || 'public'
    });
    return response.data;
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};

// Get shares for a post
export const getPostShares = async (postId, params = {}) => {
  try {
    const { page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axios.get(`/api/candidate/posts/${postId}/shares?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post shares:', error);
    throw error;
  }
};

// UTILITY FUNCTIONS

// Extract hashtags from text
export const extractHashtags = (text) => {
  const hashtagRegex = /#[\w]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
};

// Extract mentions from text
export const extractMentions = (text) => {
  const mentionRegex = /@[\w]+/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1)) : [];
};

// Format time ago
export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d`;
  } else {
    return postDate.toLocaleDateString();
  }
};