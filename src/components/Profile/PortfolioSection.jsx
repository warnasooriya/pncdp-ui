import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Box,
  Link
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { setField } from '../../reducers/profileReducer';
import axios from '../../api/axios';
import LoadingOverlay from '../common/LoadingOverlay';

const PortfolioSection = () => {
  const dispatch = useDispatch();
  const profileReducer = useSelector((state) => state.profileReducer);
  const [userId] = useState(localStorage.getItem('userId'));

  const [portfolioLinks, setPortfolioLinks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLink, setCurrentLink] = useState({ title: '', url: '' });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      if (profileReducer?.profile?.portfolio) {
        setPortfolioLinks(profileReducer.profile.portfolio);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      setIsLoading(false);
    }
  }, [profileReducer.profile]);

  const handleOpenDialog = () => {
    setCurrentLink({ title: '', url: '' });
    setEditIndex(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const syncWithBackend = async (updatedList) => {
    setIsLoading(true);
    try {
      await axios.put('/api/profile/portfolio', {
        id: userId,
        portfolio: updatedList
      });

      const res = await axios.get(`/api/profile?id=${userId}`);
      dispatch(setField({ name: 'profile', value: res.data }));
    } catch (err) {
      console.error('Failed to sync portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLink = async () => {
    let updated;
    if (editIndex !== null) {
      updated = [...portfolioLinks];
      updated[editIndex] = currentLink;
    } else {
      updated = [...portfolioLinks, currentLink];
    }

    setPortfolioLinks(updated);
    await syncWithBackend(updated);
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    setCurrentLink(portfolioLinks[index]);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
    const updated = portfolioLinks.filter((_, i) => i !== index);
    setPortfolioLinks(updated);
    await syncWithBackend(updated);
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <LoadingOverlay isLoading={isLoading} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Portfolio
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Add
          </Button>
        </Stack>

        <Stack spacing={3}>
          {portfolioLinks.map((linkItem, index) => (
            <Box key={index}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <OpenInNewIcon color="primary" />
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {linkItem.title}
                  </Typography>
                  <Link href={linkItem.url} target="_blank" rel="noopener" color="primary" underline="hover">
                    {linkItem.url}
                  </Link>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              {index !== portfolioLinks.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? 'Edit Portfolio Link' : 'Add Portfolio Link'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title (e.g., Personal Website, GitHub)"
            value={currentLink.title}
            onChange={(e) => setCurrentLink({ ...currentLink, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="URL (starting with https://)"
            value={currentLink.url}
            onChange={(e) => setCurrentLink({ ...currentLink, url: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveLink}>
            {editIndex !== null ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PortfolioSection;
