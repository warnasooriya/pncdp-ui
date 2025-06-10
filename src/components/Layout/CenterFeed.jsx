import React, { useState } from "react";
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
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import EventIcon from "@mui/icons-material/Event";
import ArticleIcon from "@mui/icons-material/Article";

const CenterFeed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Johnathan Reed",
      title: "Senior Software Engineer at TechNova",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      image:
        "https://images.unsplash.com/photo-1743485237407-e00bfb75163e?q=80&w=3840&auto=format&fit=crop",
      description:
        "Proud to complete 5 years at TechNova! 🚀 Looking forward to many more achievements with this amazing team.",
      time: "2h",
    },
    {
      id: 2,
      name: "Samantha Lewis",
      title: "Marketing Manager at GrowthHub",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      image:
        "https://plus.unsplash.com/premium_photo-1668677004084-fe555bebf9b0?q=80&w=7700&auto=format&fit=crop",
      description:
        "Excited to launch our new marketing campaign next month! Let’s break some records 📈!",
      time: "5h",
    },
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [newPostMediaType, setNewPostMediaType] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blobURL = URL.createObjectURL(file);
      setNewPostMedia(blobURL);
      setNewPostMediaType(file.type.startsWith("video") ? "video" : "image");
    }
  };

  const handleAddPost = () => {
    if (newPostText.trim() === "") return;

    const newPost = {
      id: posts.length + 1,
      name: "You",
      title: "Posting as yourself",
      avatar: "https://randomuser.me/api/portraits/lego/5.jpg",
      description: newPostText.trim(),
      image: newPostMediaType === "image" ? newPostMedia : null,
      video: newPostMediaType === "video" ? newPostMedia : null,
      time: "Just now",
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostMedia(null);
    setNewPostMediaType(null);
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
              sx={{ textTransform: "none", color: "#5e5e5e" }}
            >
              Video
            </Button>
            <Button
              startIcon={<EventIcon />}
              sx={{ textTransform: "none", color: "#5e5e5e" }}
            >
              Event
            </Button>
            <Button
              startIcon={<ArticleIcon />}
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
            disabled={newPostText.trim() === ""}
            sx={{ mt: 2, textTransform: "none", borderRadius: 3 }}
          >
            Post
          </Button>
        </Card>

        {/* Posts Section */}
        {posts.map((post) => (
          <Card key={post.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Avatar src={post.avatar} alt={post.name} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.title} • {post.time}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body1" sx={{ my: 2 }}>
                {post.description}
              </Typography>

              {post.image && (
                <CardMedia
                  component="img"
                  height="300"
                  image={post.image}
                  alt="Post Banner"
                  sx={{ borderRadius: 2 }}
                />
              )}

              {post.video && (
                <CardMedia
                  component="video"
                  height="300"
                  controls
                  src={post.video}
                  sx={{ borderRadius: 2 }}
                />
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
                    startIcon={<FavoriteBorderIcon />}
                    size="small"
                    sx={{ textTransform: "none", color: "#5e5e5e" }}
                  >
                    Like
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    240
                  </Typography>
                </Box>

                {/* Comment Button with Count */}
                <Box textAlign="center">
                  <Button
                    startIcon={<ChatBubbleOutlineIcon />}
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
                    12
                  </Typography>
                </Box>

                {/* Repost Button with Count */}
                <Box textAlign="center">
                  <Button
                    startIcon={<RepeatIcon />}
                    size="small"
                    sx={{ textTransform: "none", color: "#5e5e5e" }}
                  >
                    Repost
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    3
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
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default CenterFeed;
