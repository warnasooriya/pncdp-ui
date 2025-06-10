import React from 'react';
import { Box, Card, Typography, Stack, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ContactsIcon from '@mui/icons-material/Contacts';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PagesIcon from '@mui/icons-material/InsertDriveFile';
import NewspaperIcon from '@mui/icons-material/Article';

const ManageNetworkSidebar = () => {
  const items = [
    { icon: <GroupIcon />, label: 'Connections', count: 369 },
    { icon: <ContactsIcon />, label: 'Contacts', count: 991 },
    { icon: <PeopleAltIcon />, label: 'Following & followers', count: 120 },
    { icon: <GroupsIcon />, label: 'Groups', count: 4 },
    { icon: <EventNoteIcon />, label: 'Events', count: 1 },
    { icon: <PagesIcon />, label: 'Pages', count: 26 },
    { icon: <NewspaperIcon />, label: 'Newsletters', count: 8 }
  ];

  return (
    <Box  >
      <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Manage my network
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <List disablePadding>
          {items.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#5e5e5e' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight="bold">
                      {item.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.count}
                    </Typography>
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
