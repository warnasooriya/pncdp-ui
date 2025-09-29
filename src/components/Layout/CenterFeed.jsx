import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import EventIcon from "@mui/icons-material/Event";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  createPost,
  getFeedPosts,
  toggleLike,
  addComment,
  getPostComments,
  sharePost,
  formatTimeAgo,
  extractHashtags,
  extractMentions,
} from "../../services/postService";

const CenterFeed = () => {
  // State management
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Post creation state
  const [newPostText, setNewPostText] = useState("");
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [newPostMediaFile, setNewPostMediaFile] = useState(null);
  const [newPostMediaType, setNewPostMediaType] = useState(null);

  // Comments state
  const [expandedComments, setExpandedComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [commentLoading, setCommentLoading] = useState({});

  // Share dialog state
  const [shareDialog, setShareDialog] = useState({ open: false, post: null });
  const [shareComment, setShareComment] = useState("");

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // New feature dialogs state
  const [videoDialog, setVideoDialog] = useState(false);
  const [eventDialog, setEventDialog] = useState(false);
  const [articleDialog, setArticleDialog] = useState(false);

  // Video upload state
  const [videoFile, setVideoFile] = useState(null);
  const [videoDescription, setVideoDescription] = useState("");

  // Event creation state
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null
  });

  // Article writing state
  const [articleData, setArticleData] = useState({
    title: "",
    content: "",
    summary: "",
    image: null
  });

  // Get current user ID
  const currentUserId = localStorage.getItem('userId');

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  // Load posts from backend
  const loadPosts = async (pageNum = 1, append = false) => {
    try {
      setLoading(!append);
      const response = await getFeedPosts({
        page: pageNum,
        limit: 10,
        userId: currentUserId,
        sortBy: 'newest'
      });

      // Backend returns posts and pagination directly
      if (response && response.posts) {
        const newPosts = response.posts || [];
        if (append) {
          setPosts(prev => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        setHasMore(response.pagination?.hasMore || false);
        setPage(pageNum);
      } else {
        setError('Failed to load posts');
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load posts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blobURL = URL.createObjectURL(file);
      setNewPostMedia(blobURL);
      setNewPostMediaFile(file);
      setNewPostMediaType(file.type.startsWith("video") ? "video" : "image");
    }
  };

  const handleAddPost = async () => {
    if (newPostText.trim() === "" || !currentUserId) return;

    try {
      setPosting(true);
      const hashtags = extractHashtags(newPostText);
      const mentions = extractMentions(newPostText);

      const postData = {
        userId: currentUserId,
        content: newPostText.trim(),
        privacy: 'public',
        hashtags,
        mentions,
        media: newPostMediaFile
      };

      const response = await createPost(postData);
      
      // Backend returns the post object directly on success
      if (response && response._id) {
        // Add new post to the beginning of the list
        setPosts(prev => [response, ...prev]);
        setNewPostText("");
        setNewPostMedia(null);
        setNewPostMediaFile(null);
        setNewPostMediaType(null);
        setSnackbar({ open: true, message: "Post created successfully!", severity: "success" });
        
        // Refresh the feed to get updated data
        loadPosts(1, false);
      } else {
        setSnackbar({ open: true, message: "Failed to create post", severity: "error" });
      }
    } catch (err) {
      console.error('Error creating post:', err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create post";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setPosting(false);
    }
  };

  // Handle like toggle
  const handleLike = async (postId) => {
    if (!currentUserId) return;

    try {
      const response = await toggleLike(postId, currentUserId);
      
      // Backend returns like data directly
      if (response && typeof response.isLiked !== 'undefined') {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likesCount: response.likesCount,
                isLikedByUser: response.isLiked 
              }
            : post
        ));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setSnackbar({ open: true, message: "Failed to update like", severity: "error" });
    }
  };

  // Handle comment submission
  const handleAddComment = async (postId) => {
    const commentText = commentTexts[postId];
    if (!commentText?.trim() || !currentUserId) return;

    try {
      setCommentLoading(prev => ({ ...prev, [postId]: true }));
      
      const response = await addComment(postId, {
        userId: currentUserId,
        content: commentText.trim(),
        mentions: extractMentions(commentText)
      });

      // Backend returns the comment object directly on success
      if (response && response._id) {
        // Update post comments count
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
            : post
        ));
        
        setCommentTexts(prev => ({ ...prev, [postId]: "" }));
        setSnackbar({ open: true, message: "Comment added successfully!", severity: "success" });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setSnackbar({ open: true, message: "Failed to add comment", severity: "error" });
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!shareDialog.post || !currentUserId) return;

    try {
      const response = await sharePost(shareDialog.post._id, {
        userId: currentUserId,
        shareComment: shareComment.trim() || null,
        shareType: 'direct',
        privacy: 'public'
      });

      // Backend returns an object with message and share properties on success
      if (response && response.message) {
        // Update shares count
        setPosts(prev => prev.map(post => 
          post._id === shareDialog.post._id 
            ? { ...post, sharesCount: (post.sharesCount || 0) + 1 }
            : post
        ));
        
        setShareDialog({ open: false, post: null });
        setShareComment("");
        setSnackbar({ open: true, message: "Post shared successfully!", severity: "success" });
      }
    } catch (err) {
      console.error('Error sharing post:', err);
      setSnackbar({ open: true, message: "Failed to share post", severity: "error" });
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Handle video upload
  const handleVideoUpload = async () => {
    if (!videoFile || !currentUserId) return;

    try {
      setPosting(true);
      const hashtags = extractHashtags(videoDescription);
      const mentions = extractMentions(videoDescription);

      const postData = {
        userId: currentUserId,
        content: videoDescription.trim(),
        privacy: 'public',
        hashtags,
        mentions,
        media: videoFile,
        mediaType: 'video'
      };

      const response = await createPost(postData);
      
      if (response && response._id) {
        setPosts(prev => [response, ...prev]);
        setVideoDialog(false);
        setVideoFile(null);
        setVideoDescription("");
        setSnackbar({ open: true, message: "Video uploaded successfully!", severity: "success" });
        loadPosts(1, false);
      } else {
        setSnackbar({ open: true, message: "Failed to upload video", severity: "error" });
      }
    } catch (err) {
      console.error('Error uploading video:', err);
      setSnackbar({ open: true, message: "Failed to upload video", severity: "error" });
    } finally {
      setPosting(false);
    }
  };

  // Handle event creation
  const handleEventCreate = async () => {
    if (!eventData.title || !eventData.date || !currentUserId) return;

    try {
      setPosting(true);
      const eventContent = `🎉 Event: ${eventData.title}\n📅 Date: ${eventData.date}\n⏰ Time: ${eventData.time}\n📍 Location: ${eventData.location}\n\n${eventData.description}`;
      
      const hashtags = extractHashtags(eventContent);
      const mentions = extractMentions(eventContent);

      const postData = {
        userId: currentUserId,
        content: eventContent,
        privacy: 'public',
        hashtags,
        mentions,
        media: eventData.image,
        postType: 'event'
      };

      const response = await createPost(postData);
      
      if (response && response._id) {
        setPosts(prev => [response, ...prev]);
        setEventDialog(false);
        setEventData({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          image: null
        });
        setSnackbar({ open: true, message: "Event created successfully!", severity: "success" });
        loadPosts(1, false);
      } else {
        setSnackbar({ open: true, message: "Failed to create event", severity: "error" });
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setSnackbar({ open: true, message: "Failed to create event", severity: "error" });
    } finally {
      setPosting(false);
    }
  };

  // Handle article creation
  const handleArticleCreate = async () => {
    if (!articleData.title || !articleData.content || !currentUserId) return;

    try {
      setPosting(true);
      const articleContent = `📝 ${articleData.title}\n\n${articleData.summary ? articleData.summary + '\n\n' : ''}${articleData.content}`;
      
      const hashtags = extractHashtags(articleContent);
      const mentions = extractMentions(articleContent);

      const postData = {
        userId: currentUserId,
        content: articleContent,
        privacy: 'public',
        hashtags,
        mentions,
        media: articleData.image,
        postType: 'article'
      };

      const response = await createPost(postData);
      
      if (response && response._id) {
        setPosts(prev => [response, ...prev]);
        setArticleDialog(false);
        setArticleData({
          title: "",
          content: "",
          summary: "",
          image: null
        });
        setSnackbar({ open: true, message: "Article published successfully!", severity: "success" });
        loadPosts(1, false);
      } else {
        setSnackbar({ open: true, message: "Failed to publish article", severity: "error" });
      }
    } catch (err) {
      console.error('Error publishing article:', err);
      setSnackbar({ open: true, message: "Failed to publish article", severity: "error" });
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box sx={{ width: { xs: "100%", md: "55%" } }}>
      <Stack spacing={2}>
        {/* Start a Post Section */}
        <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />
            <TextField
              fullWidth
              placeholder="Start a post"
              size="small"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              sx={{ backgroundColor: "#f0f2f5", borderRadius: 5 }}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-around"
            alignItems="center"
          >
            <Button
              startIcon={<ImageIcon />}
              variant="text"
              component="label"
              sx={{ textTransform: "none", color: "#5e5e5e" }}
            >
              Photo
              <input
                hidden
                accept="image/*,video/*"
                type="file"
                onChange={handleFileChange}
              />
            </Button>
            <Button
              startIcon={<VideoLibraryIcon />}
              onClick={() => setVideoDialog(true)}
              sx={{ textTransform: "none", color: "#5e5e5e" }}
            >
              Video
            </Button>
            <Button
              startIcon={<EventIcon />}
              onClick={() => setEventDialog(true)}
              sx={{ textTransform: "none", color: "#5e5e5e" }}
            >
              Event
            </Button>
            <Button
              startIcon={<ArticleIcon />}
              onClick={() => setArticleDialog(true)}
              sx={{ textTransform: "none", color: "#5e5e5e" }}
            >
              Write article
            </Button>
          </Stack>

          {/* New Post Image/Video Preview */}
          {newPostMedia && (
            <Box sx={{ mt: 2 }}>
              {newPostMediaType === "image" ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={newPostMedia}
                  alt="Uploaded preview"
                  sx={{ borderRadius: 2 }}
                />
              ) : (
                <CardMedia
                  component="video"
                  height="200"
                  controls
                  src={newPostMedia}
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Box>
          )}

          {/* Post Button */}
          <Button
            variant="contained"
            onClick={handleAddPost}
            disabled={newPostText.trim() === "" || posting}
            sx={{ mt: 2, textTransform: "none", borderRadius: 3 }}
          >
            {posting ? <CircularProgress size={20} color="inherit" /> : "Post"}
          </Button>
        </Card>

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Posts Section */}
        {posts.map((post) => (
          <Card key={post._id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Avatar 
                  src={post.user?.profileImage} 
                  alt={post.user?.fullName || 'User'}
                >
                  {!post.user?.profileImage && 
                    (post.user?.fullName?.[0] || 'U')}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.user?.fullName || 'Unknown User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.user?.headline || 'User'} • {formatTimeAgo(post.createdAt)}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body1" sx={{ my: 2 }}>
                {post.content}
              </Typography>

              {post.mediaUrl && (
                <Box mb={2}>
                  {post.mediaType === 'image' || post.mediaType?.startsWith('image/') ? (
                    <CardMedia
                      component="img"
                      height="300"
                      image={post.mediaUrl}
                      alt="Post media"
                      sx={{ borderRadius: 2 }}
                    />
                  ) : post.mediaType === 'video' || post.mediaType?.startsWith('video/') ? (
                    <CardMedia
                      component="video"
                      height="300"
                      controls
                      src={post.mediaUrl}
                      sx={{ borderRadius: 2 }}
                    />
                  ) : null}
                </Box>
              )}
            </CardContent>

            <CardContent sx={{ pt: 1 }}>
              <Divider sx={{ mb: 1 }} />
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-around"
                alignItems="center"
              >
                {/* Like Button with Count */}
                <Box textAlign="center">
                  <Button
                    startIcon={
                      post.isLikedByUser ? 
                        <FavoriteIcon sx={{ color: 'red' }} /> : 
                        <FavoriteBorderIcon />
                    }
                    onClick={() => handleLike(post._id)}
                    size="small"
                    sx={{ 
                      textTransform: "none", 
                      color: post.isLikedByUser ? 'red' : '#5e5e5e'
                    }}
                  >
                    Like
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {post.likesCount || 0}
                  </Typography>
                </Box>

                {/* Comment Button with Count */}
                <Box textAlign="center">
                  <Button
                    startIcon={<ChatBubbleOutlineIcon />}
                    onClick={() => setExpandedComments(prev => ({
                       ...prev,
                       [post._id]: !prev[post._id]
                     }))}
                    size="small"
                    sx={{ textTransform: "none", color: "#5e5e5e" }}
                  >
                    Comment
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {post.commentsCount || 0}
                  </Typography>
                </Box>

                {/* Share Button with Count */}
                <Box textAlign="center">
                  <Button
                    startIcon={<ShareIcon />}
                    onClick={() => setShareDialog({ open: true, postId: post._id })}
                    size="small"
                    sx={{ textTransform: "none", color: "#5e5e5e" }}
                  >
                    Share
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {post.sharesCount || 0}
                  </Typography>
                </Box>

                {/* Send Button (no count) */}
                <Box textAlign="center">
                  <Button
                    startIcon={<SendIcon />}
                    size="small"
                    sx={{ textTransform: "none", color: "#5e5e5e" }}
                  >
                    Send
                  </Button>
                </Box>
              </Stack>

              {/* Comments Section */}
              <Collapse in={expandedComments[post._id]} timeout="auto" unmountOnExit>
                <Box mt={2} pt={2} borderTop="1px solid #e0e0e0">
                  {/* Add Comment */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                      {currentUserId?.[0] || 'U'}
                    </Avatar>
                    <TextField
                      fullWidth
                      placeholder="Write a comment..."
                      variant="outlined"
                      size="small"
                      value={commentTexts[post._id] || ''}
                      onChange={(e) => setCommentTexts(prev => ({
                        ...prev,
                        [post._id]: e.target.value
                      }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment(post._id);
                        }
                      }}
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddComment(post._id)}
                      disabled={!commentTexts[post._id]?.trim() || commentLoading[post._id]}
                    >
                      {commentLoading[post._id] ? <CircularProgress size={16} /> : 'Post'}
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}

        {/* Load More Button */}
        {hasMore && !loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <Button
              variant="outlined"
              onClick={() => setPage(prev => prev + 1)}
              sx={{ textTransform: "none" }}
            >
              Load More Posts
            </Button>
          </Box>
        )}

        {/* Share Dialog */}
         <Dialog
           open={shareDialog.open}
           onClose={() => setShareDialog({ open: false, postId: null })}
           maxWidth="sm"
           fullWidth
         >
           <DialogTitle>Share Post</DialogTitle>
           <DialogContent>
             <TextField
               fullWidth
               multiline
               rows={3}
               placeholder="Add a comment to your share..."
               value={shareComment}
               onChange={(e) => setShareComment(e.target.value)}
               sx={{ mt: 1 }}
             />
           </DialogContent>
           <DialogActions>
             <Button onClick={() => setShareDialog({ open: false, postId: null })}>
               Cancel
             </Button>
             <Button
               variant="contained"
               onClick={() => handleShare(shareDialog.postId)}
             >
               Share
             </Button>
           </DialogActions>
         </Dialog>

        {/* Video Upload Dialog */}
        <Dialog
          open={videoDialog}
          onClose={() => setVideoDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Upload Video</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<VideoLibraryIcon />}
                fullWidth
              >
                {videoFile ? videoFile.name : "Choose Video File"}
                <input
                  hidden
                  accept="video/*"
                  type="file"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
              </Button>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Add a description for your video..."
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVideoDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleVideoUpload}
              disabled={!videoFile || posting}
            >
              {posting ? <CircularProgress size={20} /> : "Upload"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Event Creation Dialog */}
        <Dialog
          open={eventDialog}
          onClose={() => setEventDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create Event</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Event Title"
                value={eventData.title}
                onChange={(e) => setEventData({...eventData, title: e.target.value})}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  type="date"
                  label="Date"
                  value={eventData.date}
                  onChange={(e) => setEventData({...eventData, date: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="time"
                  label="Time"
                  value={eventData.time}
                  onChange={(e) => setEventData({...eventData, time: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>
              <TextField
                fullWidth
                label="Location"
                value={eventData.location}
                onChange={(e) => setEventData({...eventData, location: e.target.value})}
                startAdornment={<LocationOnIcon />}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Event Description"
                value={eventData.description}
                onChange={(e) => setEventData({...eventData, description: e.target.value})}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
              >
                {eventData.image ? "Image Selected" : "Add Event Image (Optional)"}
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => setEventData({...eventData, image: e.target.files[0]})}
                />
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEventDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleEventCreate}
              disabled={!eventData.title || !eventData.date || posting}
            >
              {posting ? <CircularProgress size={20} /> : "Create Event"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Article Writing Dialog */}
        <Dialog
          open={articleDialog}
          onClose={() => setArticleDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Write Article</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Article Title"
                value={articleData.title}
                onChange={(e) => setArticleData({...articleData, title: e.target.value})}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Summary (Optional)"
                value={articleData.summary}
                onChange={(e) => setArticleData({...articleData, summary: e.target.value})}
                placeholder="Brief summary of your article..."
              />
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Article Content"
                value={articleData.content}
                onChange={(e) => setArticleData({...articleData, content: e.target.value})}
                placeholder="Write your article content here..."
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
              >
                {articleData.image ? "Cover Image Selected" : "Add Cover Image (Optional)"}
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => setArticleData({...articleData, image: e.target.files[0]})}
                />
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setArticleDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleArticleCreate}
              disabled={!articleData.title || !articleData.content || posting}
            >
              {posting ? <CircularProgress size={20} /> : "Publish Article"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default CenterFeed;
