import React from 'react';
import {
  Box, Card, Typography, Stack, Divider, List, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchNetworkData, setSelectedCategory } from '../../reducers/networkReducer'; // update path

// icons ...
import GroupIcon from '@mui/icons-material/Group';
import ContactsIcon from '@mui/icons-material/Contacts';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PagesIcon from '@mui/icons-material/InsertDriveFile';
import NewspaperIcon from '@mui/icons-material/Article';

const ManageNetworkSidebar = () => {
  const dispatch = useDispatch();

  const items = [
    { icon: <GroupIcon />, label: 'Connections', key: 'connections', count: 369 },
    { icon: <ContactsIcon />, label: 'Contacts', key: 'contacts', count: 991 },
    { icon: <PeopleAltIcon />, label: 'Following & followers', key: 'follow', count: 120 },
    { icon: <GroupsIcon />, label: 'Groups', key: 'groups', count: 4 },
    { icon: <EventNoteIcon />, label: 'Events', key: 'events', count: 1 },
    { icon: <PagesIcon />, label: 'Pages', key: 'pages', count: 26 },
    { icon: <NewspaperIcon />, label: 'Newsletters', key: 'newsletters', count: 8 }
  ];

  const handleClick = (key) => {
    dispatch(setSelectedCategory(key));
    dispatch(fetchNetworkData(key));
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Manage my network
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <List disablePadding>
          {items.map((item) => (
            <ListItemButton key={item.key} onClick={() => handleClick(item.key)}>
              <ListItemIcon sx={{ color: '#5e5e5e' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight="bold">{item.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.count}</Typography>
                  </Stack>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default ManageNetworkSidebar;
