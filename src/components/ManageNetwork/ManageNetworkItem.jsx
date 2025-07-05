import React, { useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Avatar, Button, Stack
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNetworkData } from '../../reducers/networkReducer';
import LoadingOverlay from '../common/LoadingOverlay';

const ManageNetworkItem = () => {
  const dispatch = useDispatch();
  const { data, selectedCategory, loading } = useSelector((state) => state.network);

  useEffect(() => {
    if (!data[selectedCategory]) {
      dispatch(fetchNetworkData(selectedCategory));
    }
  }, [selectedCategory, dispatch]);

  // const suggestions = data[selectedCategory] || [];
  const suggestions = Array.isArray(data[selectedCategory]) ? data[selectedCategory] : [];

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {selectedCategory?.charAt(0).toUpperCase() + selectedCategory?.slice(1)}
      </Typography>

      {loading ? (
        <LoadingOverlay />
      ) : (
        <Grid container spacing={2}>
          {suggestions?.map((user) => (
            <Grid item xs={12} sm={6} md={6} key={user.id}>
              <Card variant="outlined" sx={{ borderRadius: 3, p: 2, textAlign: 'center', '&:hover': { boxShadow: 4 } }}>
                <Stack spacing={4} alignItems="center">
                  <Avatar alt={user.fullName} src={user.profileImage} sx={{ width: 80, height: 80 }} />
                  <Box sx={{ px: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{user.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.headline}</Typography>
                  </Box>
                  <Button variant="contained" size="small" sx={{ textTransform: 'none', borderRadius: 5, backgroundColor: '#283593', px: 3 }}>
                    Connect
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ManageNetworkItem;
