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
  Avatar,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setField } from "../../reducers/profileReducer";
import LoadingOverlay from "../common/LoadingOverlay";

const ExperienceSection = () => {
  const dispatch = useDispatch();
  const profileReducer = useSelector((state) => state.profileReducer);
  const [userId] = useState(localStorage.getItem("userId"));

  const [experienceList, setExperienceList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExperience, setCurrentExperience] = useState({
    Title: "",
    Company: "",
    Location: "",
    StartDate: "",
    EndDate: "",
    Description: "",
    logo: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      if (profileReducer?.profile?.experiences) {
        setExperienceList(profileReducer.profile.experiences);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error loading experience data:", err);
    }
  }, [profileReducer.profile]);

  const handleOpenDialog = () => {
    setCurrentExperience({
      Title: "",
      Company: "",
      Location: "",
      StartDate: "",
      EndDate: "",
      Description: "",
      logo: "",
    });
    setEditIndex(null);
    setIsPresent(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const syncWithBackend = async (updatedList) => {
    setIsLoading(true);
    try {
      await axios.put("/api/profile/experiences", {
        id: userId,
        experiences: updatedList,
      });

      const res = await axios.get(`/api/profile?id=${userId}`);
      dispatch(setField({ name: "profile", value: res.data }));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Failed to update experiences:", err);
    }
  };

  const handleSaveExperience = async () => {
    const updatedExp = { ...currentExperience };
    if (isPresent) {
      updatedExp.EndDate = ""; // or null depending on backend schema
    }

    let updated;
    if (editIndex !== null) {
      updated = [...experienceList];
      updated[editIndex] = updatedExp;
    } else {
      updated = [...experienceList, updatedExp];
    }

    setExperienceList(updated);
    await syncWithBackend(updated);
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    const selected = experienceList[index];
    setCurrentExperience(selected);
    setEditIndex(index);
    setIsPresent(!selected.EndDate); // Treat empty EndDate as Present
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
    const updated = experienceList.filter((_, i) => i !== index);
    setExperienceList(updated);
    await syncWithBackend(updated);
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
        <LoadingOverlay isLoading={isLoading} />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            Experience
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
          
          {experienceList.map((exp, index) => (
            <Box key={index}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={exp.logo || ""}
                  alt="Company Logo"
                  sx={{ bgcolor: "#e0e0e0", width: 56, height: 56 }}
                >
                  <WorkOutlineIcon />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.Title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.Company} • {exp.Location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(exp.StartDate)} -{" "}
                    {exp.EndDate ? formatDate(exp.EndDate) : "Present"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {exp.Description}
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
              {index !== experienceList.length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        
        <DialogTitle>{editIndex !== null ? "Edit Experience" : "Add Experience"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <LoadingOverlay isLoading={isLoading} />
          <TextField
            label="Job Title *"
            value={currentExperience.Title}
            onChange={(e) => setCurrentExperience({ ...currentExperience, Title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Company Name *"
            value={currentExperience.Company}
            onChange={(e) => setCurrentExperience({ ...currentExperience, Company: e.target.value })}
            fullWidth
          />
          <TextField
            label="Location *"
            value={currentExperience.Location}
            onChange={(e) => setCurrentExperience({ ...currentExperience, Location: e.target.value })}
            fullWidth
          />
          <TextField
            label="Start Date *"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentExperience.StartDate}
            onChange={(e) => setCurrentExperience({ ...currentExperience, StartDate: e.target.value })}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentExperience.EndDate}
            onChange={(e) => setCurrentExperience({ ...currentExperience, EndDate: e.target.value })}
            fullWidth
            disabled={isPresent}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPresent}
                onChange={(e) => {
                  setIsPresent(e.target.checked);
                  if (e.target.checked) {
                    setCurrentExperience({ ...currentExperience, EndDate: "" });
                  }
                }}
              />
            }
            label="I currently work here"
          />
          <TextField
            label="Job Description *"
            value={currentExperience.Description}
            onChange={(e) => setCurrentExperience({ ...currentExperience, Description: e.target.value })}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Company Logo URL (optional)"
            value={currentExperience.logo}
            onChange={(e) => setCurrentExperience({ ...currentExperience, logo: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveExperience}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ExperienceSection;
