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
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import TopNav from '../components/Layout/TopNav';
import LeftSidebar from '../components/Layout/LeftSidebar';
import RightSidebar from '../components/Layout/RightSidebar';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [composeTargetUserId, setComposeTargetUserId] = useState(null);
  const targetUserId = composeTargetUserId || searchParams.get('targetUserId');

  // Get current user from localStorage or context
  const currentUserId = localStorage.getItem('userId');

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations for user:', currentUserId);
      const response = await axios.get(`/api/candidate/messages/conversations/${currentUserId}`);
      setConversations(response.data.conversations || []);
      
      // If targetUserId is provided, find or create conversation
      if (targetUserId && response.data.conversations) {
        const existingConversation = response.data.conversations.find(conv => 
          conv.participants?.some(p => p._id === targetUserId)
        );
        if (existingConversation) {
          setSelectedConversation(existingConversation._id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/candidate/messages/conversation/${conversationId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    }
  };

  // Fetch connected users
  const fetchConnectedUsers = async () => {
    try {
      setLoadingConnections(true);
      const response = await axios.get(`/api/candidate/network/connections/${currentUserId}`);
      setConnectedUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching connected users:', error);
    } finally {
      setLoadingConnections(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (selectedConversation || targetUserId) {
      setSendingMessage(true);
      try {
        let conversationId = selectedConversation;
        
        if (!selectedConversation && targetUserId) {
          const response = await axios.post('/api/candidate/messages/send', {
            senderId: currentUserId,
            receiverId: targetUserId,
            content: newMessage
          });
          conversationId = response.data.conversationId;
          setSelectedConversation(conversationId);
          await fetchConversations(); // Refresh conversations list
        } else {
          const conversation = conversations.find(c => c._id === selectedConversation);
          const otherParticipant = conversation?.participants?.find(p => p._id !== currentUserId);
          
          await axios.post('/api/candidate/messages/send', {
            senderId: currentUserId,
            receiverId: otherParticipant?._id,
            content: newMessage
          });
        }
        
        setNewMessage('');
        await fetchMessages(conversationId); // Refresh messages
        await fetchConversations(); // Update conversation list with new last message
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
      } finally {
        setSendingMessage(false);
      }
    }
  };

  // Handle conversation selection
  const handleConversationSelect = async (conversationId) => {
    setSelectedConversation(conversationId);
    setComposeTargetUserId(null);
    await fetchMessages(conversationId);
    
    // Mark messages as read
    try {
      await axios.put(`/api/candidate/messages/conversation/${conversationId}/read`);
      await fetchConversations(); // Refresh to update unread counts
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Handle starting new conversation with connected user
  const handleStartNewConversation = (user) => {
    // Set the target user for new conversation
    setSelectedConversation(null);
    setComposeTargetUserId(user._id);
    setMessages([]);
    
    // Update URL to include the target user
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('targetUserId', user._id);
    window.history.replaceState({}, '', `${location.pathname}?${newSearchParams.toString()}`);
    
    // Update the targetUserId state if it exists
    // This will allow the sendMessage function to create a new conversation
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchConversations(),
        fetchConnectedUsers()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants?.find(p => p._id !== currentUserId);
    return otherParticipant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
  });

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopNav />
      <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />
        
        <Box sx={{ flex: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex' }}>
            {/* Left Panel - Conversations and Connected Users */}
            <Box sx={{ width: 350, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
              {/* Conversations Section */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                
                <List sx={{ p: 0, overflow: 'auto', flex: 1 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredConversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
                  return <ListItem
                    key={conversation._id}
                    button
                    selected={selectedConversation === conversation._id}
                    onClick={() => handleConversationSelect(conversation._id)}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={otherParticipant?.profileImage}>
                        {otherParticipant?.fullName?.charAt(0) || 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            {otherParticipant?.fullName || 'Unknown User'}
                          </Typography>
                          {conversation.unreadCount > 0 && (
                            <Chip
                              label={conversation.unreadCount}
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
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.lastMessage?.createdAt ? 
                              new Date(conversation.lastMessage.createdAt).toLocaleDateString() : 
                              ''
                            }
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  
                })}
                </List>
              </Box>

              {/* Connected Users Section */}
              <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" gutterBottom>
                    Connected Users
                  </Typography>
                </Box>
                
                <List sx={{ p: 0, overflow: 'auto', maxHeight: 200 }}>
                  {loadingConnections ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={20} />
                    </Box>
                  ) : connectedUsers.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" color="text.secondary" align="center">
                            No connected users
                          </Typography>
                        }
                      />
                    </ListItem>
                  ) : connectedUsers.map((user) => (
                    <ListItem
                      key={user._id}
                      button
                      onClick={() => handleStartNewConversation(user)}
                      sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.profileImage}>
                          {user.fullName?.charAt(0) || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {user.fullName || 'Unknown User'}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Click to start conversation
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            {/* Chat Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {selectedConversation || targetUserId ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      {(() => {
                        const conversation = conversations.find(c => c._id === selectedConversation);
                        const otherParticipant = selectedConversation
                          ? conversation?.participants?.find(p => p._id !== currentUserId)
                          : connectedUsers.find(u => u._id === targetUserId);
                        return (
                          <>
                            <Avatar src={otherParticipant?.profileImage}>
                              {otherParticipant?.fullName?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {otherParticipant?.fullName || 'Unknown User'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {otherParticipant?.headline || 'No headline'}
                              </Typography>
                            </Box>
                          </>
                        );
                      })()}
                    </Stack>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    <Stack spacing={2}>
                      {messages.map((message) => {
                        const isOwn = (message.senderId?._id || message.senderId) === currentUserId;
                        return (
                          <Box
                            key={message._id}
                            sx={{
                              display: 'flex',
                              justifyContent: isOwn ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <Paper
                              sx={{
                                p: 1.5,
                                maxWidth: '70%',
                                bgcolor: isOwn ? 'primary.main' : 'grey.100',
                                color: isOwn ? 'white' : 'text.primary'
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
                                {new Date(message.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', minute: '2-digit' 
                                })}
                              </Typography>
                            </Paper>
                          </Box>
                        );
                      })}
                      {!selectedConversation && targetUserId && messages.length === 0 && (
                        <Typography variant="body2" color="text.secondary" align="center">
                          Start a new conversation
                        </Typography>
                      )}
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
                          if (e.key === 'Enter' && !sendingMessage) {
                            handleSendMessage();
                          }
                        }}
                        disabled={sendingMessage}
                      />
                      <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                      >
                        {sendingMessage ? <CircularProgress size={20} /> : <SendIcon />}
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
