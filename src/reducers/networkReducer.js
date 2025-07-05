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

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    data: {},
    loading: false,
    error: null,
    selectedCategory: 'connections',
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { setSelectedCategory } = networkSlice.actions;
export default networkSlice.reducer;
