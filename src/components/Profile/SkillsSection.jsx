import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  TextField,
  Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setField } from "../../reducers/profileReducer";
import LoadingOverlay from "../common/LoadingOverlay";

const SkillsSection = () => {
  const dispatch = useDispatch();
  const profileReducer = useSelector((state) => state.profileReducer);
  const [userId] = useState(localStorage.getItem("userId"));

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load skills from Redux on mount
  useEffect(() => {
    try {
      if (profileReducer?.profile?.skills) {
        setSkills(profileReducer.profile.skills);
      }
    } catch (err) {
      console.error("Error loading skills from Redux:", err);
    }
  }, [profileReducer.profile]);

  const syncWithBackend = async (updatedList) => {
    setIsLoading(true);
    try {
      await axios.put("/api/profile/skills", {
        id: userId,
        skills: updatedList
      });

      const res = await axios.get(`/api/profile?id=${userId}`);
      dispatch(setField({ name: "profile", value: res.data }));
    } catch (err) {
      console.error("Failed to update skills:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    const trimmed = newSkill.trim();
    if (trimmed !== "" && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      setNewSkill("");
      await syncWithBackend(updated);
    }
  };

  const handleDeleteSkill = async (skillToDelete) => {
    const updated = skills.filter((skill) => skill !== skillToDelete);
    setSkills(updated);
    await syncWithBackend(updated);
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <LoadingOverlay isLoading={isLoading} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Skills
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Add a skill"
            size="small"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSkill}
            sx={{ textTransform: "none" }}
          >
            Add
          </Button>
        </Stack>

        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleDeleteSkill(skill)}
              variant="outlined"
              sx={{
                borderRadius: "20px",
                px: 2,
                py: 1,
                fontWeight: 500,
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#e8eaf6",
                  borderColor: "#3f51b5",
                  color: "#3f51b5"
                }
              }}
              deleteIcon={<CloseIcon />}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
