import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios'; // adjust path as needed

export const fetchNetworkData = createAsyncThunk(
  'network/fetchData',
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/candidate/network/${category}/${localStorage.getItem('userId')}`);
      return { category, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'network/sendRequest',
  async ({ recipientId, message }, { rejectWithValue }) => {
    try {
      const requesterId = localStorage.getItem('userId');
      const response = await axios.post('/api/candidate/network/request', {
        requesterId,
        recipientId,
        message
      });
      return { recipientId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  'network/acceptRequest',
  async (connectionId, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.put(`/api/candidate/network/accept/${connectionId}`, { userId });
      return { connectionId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const declineConnectionRequest = createAsyncThunk(
  'network/declineRequest',
  async (connectionId, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.put(`/api/candidate/network/decline/${connectionId}`, { userId });
      return { connectionId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeConnection = createAsyncThunk(
  'network/removeConnection',
  async (connectionId, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.delete(`/api/candidate/network/remove/${connectionId}`, { 
        data: { userId } 
      });
      return { connectionId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchConnectionStatus = createAsyncThunk(
  'network/fetchStatus',
  async (targetUserId, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`/api/candidate/network/status/${userId}/${targetUserId}`);
      return { targetUserId, status: response.data.status };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchBatchConnectionStatus = createAsyncThunk(
  'network/fetchBatchStatus',
  async (targetUserIds, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post('/api/candidate/network/status/batch', {
        userId,
        targetUserIds
      });
      return response.data.statuses;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Helper thunk to fetch network data and connection statuses together
export const fetchNetworkDataWithStatuses = createAsyncThunk(
  'network/fetchDataWithStatuses',
  async (category, { dispatch, rejectWithValue }) => {
    try {
      // First fetch the network data
      const networkResult = await dispatch(fetchNetworkData(category)).unwrap();
      
      // Extract user IDs from the network data
      const userIds = networkResult.data
        .filter(user => user.userId) // Make sure userId exists
        .map(user => user.userId);
      
      // If there are user IDs, fetch their connection statuses
      if (userIds.length > 0) {
        await dispatch(fetchBatchConnectionStatus(userIds));
      }
      
      return networkResult;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    data: {
      suggestions: [],
      connections: [],
      pending: [],
      sent: [],
      contacts: [],
      follow: [],
      groups: [],
      events: [],
      pages: [],
      newsletters: []
    },
    loading: false,
    error: null,
    selectedCategory: 'suggestions',
    connectionStatuses: {},
    actionLoading: {},
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setActionLoading: (state, action) => {
      const { userId, loading } = action.payload;
      state.actionLoading[userId] = loading;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch network data
      .addCase(fetchNetworkData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetworkData.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.category] = action.payload.data;
      })
      .addCase(fetchNetworkData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      // Send connection request
      .addCase(sendConnectionRequest.pending, (state, action) => {
        const recipientId = action.meta.arg.recipientId;
        state.actionLoading[recipientId] = true;
        state.error = null;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        const { recipientId } = action.payload;
        state.actionLoading[recipientId] = false;
        
        // Update connection status
        state.connectionStatuses[recipientId] = {
          status: 'pending',
          isRequester: true,
          canConnect: false
        };
        
        // Remove from suggestions if currently viewing suggestions
        if (state.data.suggestions) {
          state.data.suggestions = state.data.suggestions.filter(user => user.userId !== recipientId);
        }
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        const recipientId = action.meta.arg.recipientId;
        state.actionLoading[recipientId] = false;
        state.error = action.payload?.error || 'Failed to send connection request';
      })
      
      // Accept connection request
      .addCase(acceptConnectionRequest.pending, (state, action) => {
        const connectionId = action.meta.arg;
        state.actionLoading[connectionId] = true;
        state.error = null;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        const { connectionId } = action.payload;
        state.actionLoading[connectionId] = false;
        
        // Remove from pending requests
        if (state.data.pending) {
          state.data.pending = state.data.pending.filter(user => user.connectionId !== connectionId);
        }
        
        // Refresh connections data
        state.data.connections = null;
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        const connectionId = action.meta.arg;
        state.actionLoading[connectionId] = false;
        state.error = action.payload?.error || 'Failed to accept connection request';
      })
      
      // Decline connection request
      .addCase(declineConnectionRequest.pending, (state, action) => {
        const connectionId = action.meta.arg;
        state.actionLoading[connectionId] = true;
        state.error = null;
      })
      .addCase(declineConnectionRequest.fulfilled, (state, action) => {
        const { connectionId } = action.payload;
        state.actionLoading[connectionId] = false;
        
        // Remove from pending requests
        if (state.data.pending) {
          state.data.pending = state.data.pending.filter(user => user.connectionId !== connectionId);
        }
      })
      .addCase(declineConnectionRequest.rejected, (state, action) => {
        const connectionId = action.meta.arg;
        state.actionLoading[connectionId] = false;
        state.error = action.payload?.error || 'Failed to decline connection request';
      })
      
      // Remove connection
      .addCase(removeConnection.pending, (state, action) => {
        const connectionId = action.meta.arg;
        state.actionLoading[connectionId] = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        const { connectionId } = action.payload;
        state.actionLoading[connectionId] = false;
        
        // Remove from connections
        if (state.data.connections) {
          state.data.connections = state.data.connections.filter(user => user.connectionId !== connectionId);
        }
      })
      .addCase(removeConnection.rejected, (state, action) => {
        const connectionId = action.meta.arg;
        state.actionLoading[connectionId] = false;
        state.error = action.payload?.error || 'Failed to remove connection';
      })
      
      // Fetch connection status
      .addCase(fetchConnectionStatus.fulfilled, (state, action) => {
        const { targetUserId, status } = action.payload;
        state.connectionStatuses[targetUserId] = status;
      })
      
      // Fetch batch connection status
      .addCase(fetchBatchConnectionStatus.fulfilled, (state, action) => {
        // action.payload is the statuses object from the API
        Object.keys(action.payload).forEach(targetUserId => {
          state.connectionStatuses[targetUserId] = action.payload[targetUserId];
        });
      });
  },
});

export const { setSelectedCategory, clearError, setActionLoading } = networkSlice.actions;
export default networkSlice.reducer;
