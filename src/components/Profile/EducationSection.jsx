import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setField } from "../../reducers/profileReducer";
import LoadingOverlay from "../common/LoadingOverlay";

const EducationSection = () => {
  const dispatch = useDispatch();
  const profileReducer = useSelector((state) => state.profileReducer);
  const [userId] = useState(localStorage.getItem("userId"));

  const [educationList, setEducationList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({
    degree: "",
    university: "",
    duration: "",
    description: "",
    logo: ""
  });
  const [editIndex, setEditIndex] = useState(null);

  // Load education from Redux on mount
  useEffect(() => {
    setIsLoading(true);
    try {
      if (profileReducer?.profile?.educations) {
        setEducationList(profileReducer.profile.educations);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error loading education data:", err);
    }
  }, [profileReducer.profile]);

  const handleOpenDialog = () => {
    setCurrentEducation({
      degree: "",
      university: "",
      duration: "",
      description: "",
      logo: ""
    });
    setEditIndex(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const syncWithBackend = async (updatedList) => {
    setIsLoading(true);
    try {
      await axios.put("/api/profile/education", {
        id: userId,
        educations: updatedList
      });

      const res = await axios.get(`/api/profile?id=${userId}`);
      dispatch(setField({ name: "profile", value: res.data }));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Failed to update education:", err);
    }
  };

  const handleSaveEducation = async () => {
    let updated;
    if (editIndex !== null) {
      updated = [...educationList];
      updated[editIndex] = currentEducation;
    } else {
      updated = [...educationList, currentEducation];
    }

    setEducationList(updated);
    await syncWithBackend(updated);
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    setCurrentEducation(educationList[index]);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
    const updated = educationList.filter((_, i) => i !== index);
    setEducationList(updated);
    await syncWithBackend(updated);
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <LoadingOverlay isLoading={isLoading} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Education
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            size="small"
            sx={{ textTransform: "none" }}
          >
            Add
          </Button>
        </Stack>

        <Stack spacing={3}>
          {educationList.map((edu, index) => (
            <Box key={index}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={edu.logo || ""}
                  alt="University Logo"
                  sx={{ bgcolor: "#e0e0e0", width: 56, height: 56 }}
                >
                  <SchoolIcon />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.university} • {edu.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {edu.description}
                  </Typography>
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
              {index !== educationList.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? "Edit Education" : "Add Education"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <LoadingOverlay isLoading={isLoading} />
          <TextField
            label="Degree or Qualification"
            value={currentEducation.degree}
            onChange={(e) =>
              setCurrentEducation({ ...currentEducation, degree: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="University / Institute"
            value={currentEducation.university}
            onChange={(e) =>
              setCurrentEducation({ ...currentEducation, university: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Duration (e.g., 2015 - 2019)"
            value={currentEducation.duration}
            onChange={(e) =>
              setCurrentEducation({ ...currentEducation, duration: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description (optional)"
            value={currentEducation.description}
            onChange={(e) =>
              setCurrentEducation({ ...currentEducation, description: e.target.value })
            }
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="University Logo URL (optional)"
            value={currentEducation.logo}
            onChange={(e) =>
              setCurrentEducation({ ...currentEducation, logo: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEducation}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EducationSection;
