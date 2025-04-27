import React, { useState } from 'react';
import { Box, Stack, Card, CardContent, CardMedia, Typography, IconButton, Divider } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Avatar from '@mui/material/Avatar';

const CenterFeed = () => {
  // Dummy feed posts
  const [posts] = useState([
    {
      id: 1,
      name: 'Johnathan Reed',
      title: 'Senior Software Engineer at TechNova',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      image: 'https://images.unsplash.com/photo-1743485237407-e00bfb75163e?q=80&w=3840&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Proud to complete 5 years at TechNova! 🚀 Looking forward to many more achievements with this amazing team.',
    },
    {
      id: 2,
      name: 'Samantha Lewis',
      title: 'Marketing Manager at GrowthHub',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      image: 'https://plus.unsplash.com/premium_photo-1668677004084-fe555bebf9b0?q=80&w=7700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Excited to launch our new marketing campaign next month! Let’s break some records 📈!',
    },
    {
      id: 3,
      name: 'Daniel Moore',
      title: 'Product Designer at CreateLabs',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      image: 'https://plus.unsplash.com/premium_photo-1726842420928-e2d727ca4b9f?q=80&w=4500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Published a new article about user-centered design strategies. Feel free to check it out!',
    },
    {
      id: 4,
      name: 'Emily Parker',
      title: 'Data Scientist at BrightData',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      image: 'https://images.unsplash.com/photo-1637693324329-a1081b3fa7fb?q=80&w=1880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Sharing some insights from my recent data science project 📊 — truly fascinating what numbers can reveal!',
    },
    {
      id: 5,
      name: 'Chris Johnson',
      title: 'Cloud Engineer at SkyTech',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      image: 'https://plus.unsplash.com/premium_photo-1727251506974-e22973c60c27?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Recently earned AWS Certified Solutions Architect certification! Feeling accomplished and ready for new challenges. ☁️',
    }
  ]);
  

  return (
    <Box sx={{ width: { xs: '100%', md: '55%' } }}>
      <Stack spacing={2}>
        {posts.map((post) => (
          <Card key={post.id} variant="outlined">
            <CardContent sx={{ pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Avatar src={post.avatar} alt={post.name} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.title}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body1" sx={{ my: 1 }}>
                {post.description}
              </Typography>

            </CardContent>

            {post.image && (
              <CardMedia
                component="img"
                height="300"
                image={post.image}
                alt="Post Banner"
              />
            )}

            <CardContent sx={{ pt: 1 }}>
              <Divider sx={{ mb: 1 }} />
              <Stack direction="row" spacing={2}>
                <IconButton size="small">
                  <FavoriteBorderIcon />
                </IconButton>
                <IconButton size="small">
                  <ChatBubbleOutlineIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default CenterFeed;
