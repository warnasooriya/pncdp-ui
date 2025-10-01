import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchNetworkDataWithStatuses, 
  sendConnectionRequest, 
  acceptConnectionRequest, 
  declineConnectionRequest, 
  removeConnection,
  fetchBatchConnectionStatus,
  clearError
} from '../../reducers/networkReducer';
import {
  Box, Card, Typography, Avatar, Button, Grid, Stack, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert, IconButton, Menu, MenuItem
} from '@mui/material';
import { 
  PersonAdd, 
  Check, 
  Close, 
  PersonRemove, 
  MoreVert,
  Message,
  Person
} from '@mui/icons-material';
import LoadingOverlay from '../common/LoadingOverlay';

const ManageNetworkItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, selectedCategory, loading, connectionStatuses, actionLoading, error } = useSelector((state) => state.network);
  
  // Get user info from localStorage since auth reducer doesn't exist
  const currentUserId = localStorage.getItem('userId');
  console.log('Current User ID:', currentUserId);
  const [messageDialog, setMessageDialog] = useState({ open: false, userId: null });
  const [connectionMessage, setConnectionMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [menuAnchor, setMenuAnchor] = useState({ element: null, userId: null, connectionId: null });

  // Get current data based on selected category
  const currentData = data[selectedCategory] || [];
  const suggestions = Array.isArray(currentData) ? currentData : [];

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchNetworkDataWithStatuses(selectedCategory));
    }
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    // Fetch batch connection statuses for all users in current data
    const currentData = data[selectedCategory];
    if (currentData?.length > 0) {
      const userIds = currentData
        .filter(userData => userData.userId || userData._id || userData.id)
        .map(userData => userData.userId || userData._id || userData.id);
      
      if (userIds.length > 0) {
        dispatch(fetchBatchConnectionStatus(userIds));
      }
    }
  }, [data, selectedCategory, dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSendConnection = async (userId) => {
    try {
      console.log('Sending connection request to user:', userId);
      await dispatch(sendConnectionRequest({ 
        recipientId: userId, 
        message: connectionMessage 
      })).unwrap();
      
      setSnackbar({ open: true, message: 'Connection request sent!', severity: 'success' });
      setMessageDialog({ open: false, userId: null });
      setConnectionMessage('');
      
      // Add a small delay to ensure database is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh network data with statuses for current category and sent requests
      console.log('Refreshing network data with statuses for category:', selectedCategory);
      await dispatch(fetchNetworkDataWithStatuses(selectedCategory));
      
      if (selectedCategory !== 'sent') {
        console.log('Refreshing sent requests data with statuses');
        await dispatch(fetchNetworkDataWithStatuses('sent'));
      }
      
      console.log('Connection request process completed');
    } catch (error) {
      console.error('Error in handleSendConnection:', error);
      setSnackbar({ open: true, message: 'Failed to send connection request', severity: 'error' });
    }
  };

  const handleAcceptConnection = async (connectionId) => {
    console.log('Accepting connection with connectionId:', connectionId);
    try {
      await dispatch(acceptConnectionRequest(connectionId)).unwrap();
      setSnackbar({ open: true, message: 'Connection accepted!', severity: 'success' });
      if (selectedCategory === 'pending') {
        dispatch(fetchNetworkDataWithStatuses(selectedCategory));
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
      setSnackbar({ open: true, message: 'Failed to accept connection', severity: 'error' });
    }
  };

  const handleDeclineConnection = async (connectionId) => {
    console.log('Declining connection with connectionId:', connectionId);
    try {
      await dispatch(declineConnectionRequest(connectionId)).unwrap();
      setSnackbar({ open: true, message: 'Connection declined', severity: 'info' });
      if (selectedCategory === 'pending' || selectedCategory === 'sent') {
        dispatch(fetchNetworkDataWithStatuses(selectedCategory));
      }
    } catch (error) {
      console.error('Error declining connection:', error);
      setSnackbar({ open: true, message: 'Failed to decline connection', severity: 'error' });
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    console.log('Removing connection with connectionId:', connectionId);
    try {
      await dispatch(removeConnection(connectionId)).unwrap();
      setSnackbar({ open: true, message: 'Connection removed', severity: 'info' });
      if (selectedCategory === 'connections') {
        dispatch(fetchNetworkDataWithStatuses(selectedCategory));
      }
    } catch (error) {
      console.error('Error removing connection:', error);
      setSnackbar({ open: true, message: 'Failed to remove connection', severity: 'error' });
    }
  };

  const getConnectionStatus = (userId) => {
    return connectionStatuses[userId] || 'none';
  };

  const renderActionButton = (userData) => {
    const userId = userData._id || userData.id;
    const connectionId = userData.connectionId; // Get connectionId from userData
    console.log('renderActionButton - userData:', userData, 'userId:', userId, 'connectionId:', connectionId, 'category:', selectedCategory);
    const status = getConnectionStatus(userId);
    const isLoading = actionLoading[connectionId] || actionLoading[userId]; // Check loading for both connectionId and userId

    switch (selectedCategory) {
      case 'suggestions':
        return (
          <Button
            variant="contained"
            fullWidth
            startIcon={<PersonAdd />}
            onClick={() => setMessageDialog({ open: true, userId })}
            disabled={isLoading || status === 'pending_sent'}
            sx={{
              borderRadius: 20,
              textTransform: 'none',
              fontWeight: 'bold',
              bgcolor: status === 'pending_sent' ? '#gray' : '#1976d2'
            }}
          >
            {status === 'pending_sent' ? 'Request Sent' : 'Connect'}
          </Button>
        );

      case 'pending':
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Check />}
              onClick={() => handleAcceptConnection(connectionId)}
              disabled={isLoading}
              sx={{ borderRadius: 20, textTransform: 'none', flex: 1 }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              startIcon={<Close />}
              onClick={() => handleDeclineConnection(connectionId)}
              disabled={isLoading}
              sx={{ borderRadius: 20, textTransform: 'none', flex: 1 }}
            >
              Decline
            </Button>
          </Stack>
        );

      case 'sent':
        return (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => handleDeclineConnection(connectionId)}
            disabled={isLoading}
            sx={{
              borderRadius: 20,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Cancel Request
          </Button>
        );

      case 'connections':
        return (
          <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<Person />}
                onClick={() => navigate(`/profile/${userId}`)}
                sx={{ borderRadius: 20, textTransform: 'none', flex: 1 }}
              >
                View Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<Message />}
                onClick={() => navigate(`/messages?userId=${userId}`)}
                sx={{ borderRadius: 20, textTransform: 'none', flex: 1 }}
              >
                Message
              </Button>
            </Stack>
            <IconButton
              onClick={(e) => setMenuAnchor({ element: e.currentTarget, userId, connectionId })}
              size="small"
              sx={{ alignSelf: 'center' }}
            >
              <MoreVert />
            </IconButton>
          </Stack>
        );

      default:
        return (
          <Button
            variant="contained"
            fullWidth
            startIcon={<PersonAdd />}
            onClick={() => setMessageDialog({ open: true, userId })}
            disabled={isLoading}
            sx={{
              borderRadius: 20,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Connect
          </Button>
        );
    }
  };

  const getPageTitle = () => {
    switch (selectedCategory) {
      case 'suggestions': return 'People you may know';
      case 'connections': return 'Your Connections';
      case 'pending': return 'Pending Requests';
      case 'sent': return 'Sent Requests';
      case 'contacts': return 'Contacts';
      default: return selectedCategory?.charAt(0).toUpperCase() + selectedCategory?.slice(1);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {getPageTitle()}
      </Typography>

      {loading ? (
        <LoadingOverlay />
      ) : suggestions?.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No {selectedCategory} found
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {suggestions?.map((userData) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={userData._id || userData.id}>
              <Card variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center', height: '100%' }}>
                <Avatar
                  src={userData.profileImage}
                  alt={userData.fullName}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h6" fontWeight="bold" mb={1} noWrap>
                  {userData.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                  {userData.headline || 'Professional'}
                </Typography>
                
                {/* Connection Status Indicator */}
                {selectedCategory === 'connections' && (
                  <Chip 
                    label="Connected" 
                    size="small" 
                    color="success" 
                    sx={{ mb: 2 }}
                  />
                )}
                
                {renderActionButton(userData)}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Connection Message Dialog */}
      <Dialog 
        open={messageDialog.open} 
        onClose={() => setMessageDialog({ open: false, userId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Connection Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Add a personal message (optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={connectionMessage}
            onChange={(e) => setConnectionMessage(e.target.value)}
            placeholder="Hi, I'd like to connect with you on NextGenCareerHub!"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialog({ open: false, userId: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleSendConnection(messageDialog.userId)}
            variant="contained"
            disabled={actionLoading[messageDialog.userId]}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Connection Actions Menu */}
      <Menu
        anchorEl={menuAnchor.element}
        open={Boolean(menuAnchor.element)}
        onClose={() => setMenuAnchor({ element: null, userId: null, connectionId: null })}
      >
        <MenuItem 
          onClick={() => {
            handleRemoveConnection(menuAnchor.connectionId);
            setMenuAnchor({ element: null, userId: null, connectionId: null });
          }}
        >
          <PersonRemove sx={{ mr: 1 }} />
          Remove Connection
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageNetworkItem;
