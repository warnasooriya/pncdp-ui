import React, { useEffect } from 'react';
import {
  Box, Card, Typography, Stack, Divider, List, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNetworkDataWithStatuses, setSelectedCategory } from '../../reducers/networkReducer'; // update path

// icons ...
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PendingIcon from '@mui/icons-material/Pending';
import SendIcon from '@mui/icons-material/Send';
import ContactsIcon from '@mui/icons-material/Contacts';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PagesIcon from '@mui/icons-material/InsertDriveFile';
import NewspaperIcon from '@mui/icons-material/Article';

const ManageNetworkSidebar = () => {
  const dispatch = useDispatch();
  const { selectedCategory, data } = useSelector((state) => state.network);

  const connectionItems = [
    { icon: <PersonAddIcon />, label: 'Suggestions', key: 'suggestions' },
    { icon: <GroupIcon />, label: 'Connections', key: 'connections' },
    { icon: <PendingIcon />, label: 'Pending Requests', key: 'pending' },
    { icon: <SendIcon />, label: 'Sent Requests', key: 'sent' },
  ];

  const otherItems = [
    { icon: <ContactsIcon />, label: 'Contacts', key: 'contacts' },
    { icon: <PeopleAltIcon />, label: 'Following & followers', key: 'follow' },
    { icon: <GroupsIcon />, label: 'Groups', key: 'groups' },
    { icon: <EventNoteIcon />, label: 'Events', key: 'events' },
    { icon: <PagesIcon />, label: 'Pages', key: 'pages' },
    { icon: <NewspaperIcon />, label: 'Newsletters', key: 'newsletters' }
  ];

  // Load data for all main categories on component mount
  useEffect(() => {
    const mainCategories = ['suggestions', 'connections', 'pending', 'sent'];
    console.log('Loading data for all categories:', mainCategories);
    mainCategories.forEach(category => {
      console.log('Fetching data for category:', category);
      dispatch(fetchNetworkDataWithStatuses(category));
    });
  }, [dispatch]);

  const handleClick = (key) => {
    dispatch(setSelectedCategory(key));
    dispatch(fetchNetworkDataWithStatuses(key));
  };

  const getItemCount = (key) => {
    const count = data[key]?.length || 0;
    console.log(`Count for ${key}:`, count, 'Data:', data[key]);
    return count;
  };

  const renderListItem = (item) => (
    <ListItemButton 
      key={item.key} 
      onClick={() => handleClick(item.key)}
      selected={selectedCategory === item.key}
      sx={{
        borderRadius: 1,
        mb: 0.5,
        '&.Mui-selected': {
          backgroundColor: '#e3f2fd',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
        },
      }}
    >
      <ListItemIcon sx={{ color: selectedCategory === item.key ? '#1976d2' : '#5e5e5e' }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="body2" 
              fontWeight={selectedCategory === item.key ? "bold" : "normal"}
              color={selectedCategory === item.key ? '#1976d2' : 'inherit'}
            >
              {item.label}
            </Typography>
            {connectionItems.includes(item) && (
              <Typography variant="body2" color="text.secondary">
                {getItemCount(item.key)}
              </Typography>
            )}
          </Stack>
        }
      />
    </ListItemButton>
  );

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Manage my network
        </Typography>
        <Divider sx={{ mb: 1 }} />
        
        {/* Connection Management Section */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 1 }}>
          Connections
        </Typography>
        <List disablePadding>
          {connectionItems.map(renderListItem)}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Other Network Features */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Other
        </Typography>
        <List disablePadding>
          {otherItems.map(renderListItem)}
        </List>
      </Card>
    </Box>
  );
};

export default ManageNetworkSidebar;
