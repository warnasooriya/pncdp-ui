import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getJobs } from "../../reducers/jobsReducer";
import LoadingOverlay from "../common/LoadingOverlay";

const JobItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobsReducer);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Helper function to localize createdAt
  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    if (isNaN(date)) return createdAt;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <LoadingOverlay isLoading={loading} />
      <Typography variant="h5" fontWeight="bold" mb={2}>
        <WorkOutlineIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Find Your Next Opportunity
      </Typography>

      <Box sx={{ backgroundColor: "#ffffff", p: 0, borderRadius: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search jobs by title, company, or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
        />
      </Box>

      <Grid container spacing={4}>
        {filteredJobs.map((job) => (
           <Grid item xs={12} sm={6} md={6} key={job.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: 1,
                backgroundColor: "#ffffff",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.02)",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleJobClick(job.id)}
            >
              <Box
                sx={{
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fafafa",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={job.banner}
                   
                  sx={{
                    maxHeight: 115,
                    maxWidth: 250,
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Divider />

              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={0.5}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      {job.company} • {job.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted {formatCreatedAt(job.createdAt)}
                    </Typography>
                  </Box>

                  <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                    <BookmarkBorderIcon sx={{ color: "#5e5e5e" }} />
                  </IconButton>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={1}>
                  <Chip label={job.jobType} size="small" color="primary" />
                </Stack>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    fullWidth
                    sx={{ textTransform: "none", borderRadius: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobClick(job._id);
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JobItems;
