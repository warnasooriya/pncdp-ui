import React, { useState } from 'react';
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
  Avatar 
} from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([
    {
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: 'Issued Jan 2023',
      description: 'Credential validating expertise in AWS cloud solutions.',
      logo: 'https://source.unsplash.com/50x50/?certificate'
    },
    {
      title: 'Certified Scrum Master (CSM)',
      issuer: 'Scrum Alliance',
      date: 'Issued May 2022',
      description: 'Demonstrated knowledge of Agile Scrum practices and team facilitation.',
      logo: 'https://source.unsplash.com/50x50/?award'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentCertification, setCurrentCertification] = useState({ title: '', issuer: '', date: '', description: '', logo: '' });
  const [editIndex, setEditIndex] = useState(null);

  const handleOpenDialog = () => {
    setCurrentCertification({ title: '', issuer: '', date: '', description: '', logo: '' });
    setEditIndex(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveCertification = () => {
    if (editIndex !== null) {
      const updated = [...certifications];
      updated[editIndex] = currentCertification;
      setCertifications(updated);
    } else {
      setCertifications([...certifications, currentCertification]);
    }
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    setCurrentCertification(certifications[index]);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    const updated = certifications.filter((_, i) => i !== index);
    setCertifications(updated);
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Certifications
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
          {certifications.map((cert, index) => (
            <Box key={index}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar 
                  src={cert.logo || ''} 
                  alt="Certification Logo" 
                  sx={{ bgcolor: '#e0e0e0', width: 56, height: 56 }}
                >
                  <WorkspacePremiumIcon />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {cert.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cert.issuer} • {cert.date}
                  </Typography>
                  {cert.description && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {cert.description}
                    </Typography>
                  )}
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
              {index !== certifications.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? "Edit Certification" : "Add Certification"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Certification Title"
            value={currentCertification.title}
            onChange={(e) => setCurrentCertification({ ...currentCertification, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Issuer / Organization"
            value={currentCertification.issuer}
            onChange={(e) => setCurrentCertification({ ...currentCertification, issuer: e.target.value })}
            fullWidth
          />
          <TextField
            label="Issue Date (e.g., Issued Jan 2023)"
            value={currentCertification.date}
            onChange={(e) => setCurrentCertification({ ...currentCertification, date: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description (optional)"
            value={currentCertification.description}
            onChange={(e) => setCurrentCertification({ ...currentCertification, description: e.target.value })}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Certification Logo URL (optional)"
            value={currentCertification.logo}
            onChange={(e) => setCurrentCertification({ ...currentCertification, logo: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCertification}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CertificationsSection;
