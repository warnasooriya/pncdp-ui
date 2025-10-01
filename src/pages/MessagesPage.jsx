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
  const targetUserId = searchParams.get('targetUserId');

  // Get current user from localStorage or context
  const currentUser = localStorage.getItem('userId');

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations for user:', currentUser);
      const response = await axios.get(`/api/candidate/messages/conversations/${currentUser}`);
      setConversations(response.data.conversations || []);
      
      // If targetUserId is provided, find or create conversation
      if (targetUserId && response.data.conversations) {
        const existingConversation = response.data.conversations.find(conv => 
          conv.participants.some(p => p._id === targetUserId)
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
      const response = await axios.get(`/api/candidate/network/connections/${currentUser}`);
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
    
    setSendingMessage(true);
    try {
      let conversationId = selectedConversation;
      
      // If no conversation exists and we have a target user, create one
      if (!selectedConversation && targetUserId) {
        const response = await axios.post('/api/candidate/messages/send', {
          senderId: currentUser,
          receiverId: targetUserId,
          content: newMessage
        });
        conversationId = response.data.conversationId;
        setSelectedConversation(conversationId);
        await fetchConversations(); // Refresh conversations list
      } else if (selectedConversation) {
        // Send message to existing conversation
        const conversation = conversations.find(c => c._id === selectedConversation);
        const otherParticipant = conversation?.participants.find(p => p._id !== currentUser);
        
        await axios.post('/api/candidate/messages/send', {
          senderId: currentUser,
          receiverId: otherParticipant?._id,
          content: newMessage
        });
      } else {
        setError('Please select a conversation or user to message');
        setSendingMessage(false);
        return;
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
  };

  // Handle conversation selection
  const handleConversationSelect = async (conversationId) => {
    setSelectedConversation(conversationId);
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

  // Polling for new messages and conversations
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // Refresh conversations to get updated message counts and last messages
      fetchConversations();
      
      // Refresh messages for the selected conversation
      if (selectedConversation) {
        fetchMessages(selectedConversation);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p._id !== currentUser);
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
                  const otherParticipant = conversation.participants.find(p => p._id !== currentUser);
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
                          <Typography variant="subtitle2" sx={{ fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal' }}>
                            {otherParticipant?.fullName || 'Unknown User'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {conversation.messageCount > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                {conversation.messageCount} msg{conversation.messageCount !== 1 ? 's' : ''}
                              </Typography>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Chip
                                label={conversation.unreadCount}
                                size="small"
                                color="primary"
                                sx={{ minWidth: 20, height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
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
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {(() => {
                          const conversation = conversations.find(c => c._id === selectedConversation);
                          const otherParticipant = conversation?.participants.find(p => p._id !== currentUser);
                          return (
                            <>
                              <Avatar src={otherParticipant?.profileImage} sx={{ width: 48, height: 48 }}>
                                {otherParticipant?.fullName?.charAt(0) || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
                      
                      {/* Conversation Stats */}
                      <Box sx={{ textAlign: 'right' }}>
                        {(() => {
                          const conversation = conversations.find(c => c._id === selectedConversation);
                          return (
                            <Stack spacing={0.5}>
                              {conversation?.messageCount > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
                                </Typography>
                              )}
                              {conversation?.unreadCount > 0 && (
                                <Chip
                                  label={`${conversation.unreadCount} unread`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          );
                        })()}
                      </Box>
                    </Stack>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
                    <Stack spacing={1}>
                      {messages.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No messages yet. Start the conversation!
                          </Typography>
                        </Box>
                      ) : (
                        messages.map((message, index) => {
                          const isOwn = message.senderId._id === currentUser;
                          const showAvatar = index === 0 || messages[index - 1].senderId._id !== message.senderId._id;
                          const showTimestamp = index === messages.length - 1 || 
                            new Date(messages[index + 1].createdAt) - new Date(message.createdAt) > 300000; // 5 minutes
                          
                          return (
                            <Box key={message._id}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: isOwn ? 'row-reverse' : 'row',
                                  alignItems: 'flex-end',
                                  gap: 1,
                                  mb: showTimestamp ? 1 : 0
                                }}
                              >
                                {/* Avatar */}
                                <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'flex-end' }}>
                                  {showAvatar && !isOwn && (
                                    <Avatar 
                                      src={message.senderId.profileImage} 
                                      sx={{ width: 28, height: 28, fontSize: '0.8rem' }}
                                    >
                                      {message.senderId.fullName?.charAt(0) || 'U'}
                                    </Avatar>
                                  )}
                                </Box>

                                {/* Message Bubble */}
                                <Paper
                                  elevation={1}
                                  sx={{
                                    p: 1.5,
                                    maxWidth: '65%',
                                    bgcolor: isOwn ? 'primary.main' : 'white',
                                    color: isOwn ? 'white' : 'text.primary',
                                    borderRadius: 2,
                                    borderTopLeftRadius: !isOwn && showAvatar ? 0.5 : 2,
                                    borderTopRightRadius: isOwn && showAvatar ? 0.5 : 2,
                                    position: 'relative'
                                  }}
                                >
                                  {!isOwn && showAvatar && (
                                    <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8, display: 'block', mb: 0.5 }}>
                                      {message.senderId.fullName}
                                    </Typography>
                                  )}
                                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                    {message.content}
                                  </Typography>
                                </Paper>
                              </Box>

                              {/* Timestamp */}
                              {showTimestamp && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: 'block',
                                    textAlign: isOwn ? 'right' : 'left',
                                    mt: 0.5,
                                    ml: isOwn ? 0 : 5,
                                    mr: isOwn ? 5 : 0
                                  }}
                                >
                                  {(() => {
                                    const messageDate = new Date(message.createdAt);
                                    const now = new Date();
                                    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
                                    
                                    if (diffInHours < 24) {
                                      return messageDate.toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      });
                                    } else if (diffInHours < 168) { // 7 days
                                      return messageDate.toLocaleDateString([], { 
                                        weekday: 'short',
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      });
                                    } else {
                                      return messageDate.toLocaleDateString([], { 
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      });
                                    }
                                  })()}
                                </Typography>
                              )}
                            </Box>
                          );
                        })
                      )}
                    </Stack>
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Stack direction="row" spacing={1} alignItems="flex-end">
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && !sendingMessage) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={sendingMessage}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'grey.50',
                            '&:hover': {
                              bgcolor: 'grey.100'
                            },
                            '&.Mui-focused': {
                              bgcolor: 'white'
                            }
                          }
                        }}
                      />
                      <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark'
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'grey.300',
                            color: 'grey.500'
                          },
                          width: 48,
                          height: 48
                        }}
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