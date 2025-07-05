import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TopNav from "../Layout/TopNav";
import LeftSidebar from "../Layout/LeftSidebar";
import RightSidebar from "../Layout/RightSidebar";
import axios from "../../api/axios-recruiter";
import LoadingOverlay from "../common/LoadingOverlay";
import dayjs from 'dayjs';
const ApplicantsListPage = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'error', 'info', 'warning'
  });

  const [loading, setLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setHob] = useState(null);

   

  const fetchJobById = async (jobId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/recruiter/jobs/getjobById/${jobId}`);
      setLoading(false);
      setHob(response.data);
      // return response.data;
    } catch (error) {
      console.error("Error fetching job:", error);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    fetchJobById(id);
  }, [id]);

 
  if (!job) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Job not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <TopNav />
      <Box sx={{ display: "flex", mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />




        {/* Center Job Content */}
        <Box sx={{ flex: 1 }}>
          <LoadingOverlay isLoading={loading} />

          {job.applications.length > 0 && (
  <Box mb={4}>
    <Typography variant="h6" fontWeight="bold" mb={2}>
      🏅 Top Shortlisted Candidates
    </Typography>
    {job.applications.map((app, index) => (
      <Card key={app._id} variant="outlined" sx={{ mb: 2, p: 2, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={app.profileImage} alt={app.usereFullName} />
          <Box flex={1}>
            <Typography fontWeight="bold">
            {'#' + Number(index + 1)}  {app.usereFullName} - {app.usereHeadline}  
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {app.usereEail} |   📅 {dayjs(app.appliedAt).format('YYYY-MM-DD HH:mm')}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              📄 <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
            </Typography>

            {app.appliedAt && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                📅 Applied on: {dayjs(app.appliedAt).format('YYYY-MM-DD HH:mm')}
              </Typography>
            )}
          </Box>
          <Chip label={`Score: ${app.rankScore || 'N/A'}`} color="success" />
        </Stack>

        {app.systemExplanation && (
          <Typography variant="body2" sx={{ mt: 1, color: '#444' }}>
            🧠 <strong>Reason:</strong> {app.systemExplanation}
          </Typography>
        )}
      </Card>
    ))}
  </Box>
)}

          <Card
            variant="outlined"
            sx={{ borderRadius: 3, p: 0, backgroundColor: "white" }}
          >
            {/* Banner Image */}
            {job.banner && (
              <Box
                sx={{
                  width: "100%",
                  // height: 250,
                  overflow: "hidden",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <img
                  src={job.banner}
                  alt="Job Banner"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            )}

            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Stack spacing={2} mb={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    {job?.user?.picture && (
                      <Avatar
                        src={job?.user?.picture}
                        alt={job?.user?.name}
                        sx={{ width: 64, height: 64 }}
                      />
                    )}
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job?.user?.name} | {job.location}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="primary"
                      title="Back"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <IconButton color="primary" title="Save">
                      <BookmarkBorderIcon />
                    </IconButton>
                    <IconButton color="primary" title="Share">
                      <ShareIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Divider />
              </Stack>

              {/* Job Type */}
              <Stack direction="row" spacing={1} mb={2}>
                <Chip label={job.jobType} size="small" color="primary" />
              </Stack>

              {/* Description */}
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Job Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {job.description}
                </Typography>
              </Box>

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    Requirements
                  </Typography>
                  <ul style={{ paddingLeft: "20px" }}>
                    {job.requirements.map((req, index) => (
                      <li key={index}>
                        <Typography variant="body2" color="text.secondary">
                          {req}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {/* Publisher Info */}
              {job.postedBy && (
                <Box mt={2} mb={3}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Published by
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={job.postedBy.logo}
                      alt={job.postedBy.name}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Typography variant="body1" fontWeight="medium">
                      {job.postedBy.name}
                    </Typography>
                  </Stack>
                </Box>
              )}

               

        
              
            </CardContent>
          </Card>
        </Box>

        <RightSidebar />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ApplicantsListPage;
