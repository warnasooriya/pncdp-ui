import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Stack,
  Badge,
  Chip,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import TopNav from '../components/Layout/TopNav';
import LeftSidebar from '../components/Layout/LeftSidebar';
import RightSidebar from '../components/Layout/RightSidebar';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for conversations
  const [conversations] = useState([
    {
      id: 1,
      name: 'John Doe',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Thanks for connecting! Looking forward to collaborating.',
      timestamp: '2 hours ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Great profile! Would love to discuss the project.',
      timestamp: '1 day ago',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'The meeting went well. Let me know your thoughts.',
      timestamp: '3 days ago',
      unread: 1,
      online: true
    }
  ]);

  // Mock messages for selected conversation
  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'John Doe', content: 'Hi! Thanks for accepting my connection request.', timestamp: '10:30 AM', isOwn: false },
      { id: 2, sender: 'You', content: 'Hello John! Nice to connect with you.', timestamp: '10:32 AM', isOwn: true },
      { id: 3, sender: 'John Doe', content: 'Thanks for connecting! Looking forward to collaborating.', timestamp: '10:35 AM', isOwn: false }
    ],
    2: [
      { id: 1, sender: 'Sarah Wilson', content: 'Great profile! Would love to discuss the project.', timestamp: 'Yesterday', isOwn: false }
    ],
    3: [
      { id: 1, sender: 'Mike Johnson', content: 'The meeting went well. Let me know your thoughts.', timestamp: '3 days ago', isOwn: false }
    ]
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg = {
        id: Date.now(),
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
      }));
      
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopNav />
      <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />
        
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex' }}>
            {/* Conversations List */}
            <Box sx={{ width: 350, borderRight: 1, borderColor: 'divider' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                  Messages
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
              
              <List sx={{ p: 0, overflow: 'auto', height: 'calc(100% - 120px)' }}>
                {filteredConversations.map((conversation) => (
                  <ListItem
                    key={conversation.id}
                    button
                    selected={selectedConversation === conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="success"
                        variant="dot"
                        invisible={!conversation.online}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      >
                        <Avatar src={conversation.avatar}>
                          {conversation.name.charAt(0)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            {conversation.name}
                          </Typography>
                          {conversation.unread > 0 && (
                            <Chip
                              label={conversation.unread}
                              size="small"
                              color="primary"
                              sx={{ minWidth: 20, height: 20 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {conversation.lastMessage}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Chat Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar>
                        {conversations.find(c => c.id === selectedConversation)?.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {conversations.find(c => c.id === selectedConversation)?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {conversations.find(c => c.id === selectedConversation)?.online ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    <Stack spacing={2}>
                      {(messages[selectedConversation] || []).map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: message.isOwn ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <Paper
                            sx={{
                              p: 1.5,
                              maxWidth: '70%',
                              bgcolor: message.isOwn ? 'primary.main' : 'grey.100',
                              color: message.isOwn ? 'white' : 'text.primary'
                            }}
                          >
                            <Typography variant="body2">
                              {message.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                mt: 0.5,
                                opacity: 0.7
                              }}
                            >
                              {message.timestamp}
                            </Typography>
                          </Paper>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a conversation to start messaging
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose from your existing conversations or start a new one
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
        
        <RightSidebar />
      </Box>
    </Box>
  );
};

export default MessagesPage;