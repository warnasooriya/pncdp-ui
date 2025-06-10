import React, { useState } from "react";
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
  CardMedia,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";

const JobItems = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [jobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechNova",
      location: "Remote",
      type: "Full-time",
      posted: "2d ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "DataWorks",
      location: "Colombo, Sri Lanka",
      type: "Part-time",
      posted: "3d ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Tableau_Logo.png",
    },
    {
      id: 3,
      title: "Product Manager",
      company: "InnovateHub",
      location: "Remote",
      type: "Full-time",
      posted: "5d ago",
      logo: "https://www.prodpad.com/wp-content/uploads/2024/10/Product-Management-Life-Cycle.png",
    },
    {
      id: 4,
      title: "UI/UX Designer",
      company: "BrightApps",
      location: "Kandy, Sri Lanka",
      type: "Contract",
      posted: "1w ago",
      logo: "https://www.datocms-assets.com/38511/1660822693-ux-designer-skills.png",
    },
    {
      id: 5,
      title: "Backend Developer",
      company: "NodeWorks",
      location: "Remote",
      type: "Full-time",
      posted: "1d ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "Cloudify",
      location: "Colombo, Sri Lanka",
      type: "Full-time",
      posted: "2w ago",
      logo: "https://devopedia.org/images/article/54/7602.1513404277.png",
    },
    {
      id: 7,
      title: "Business Analyst",
      company: "ConsultPro",
      location: "Remote",
      type: "Part-time",
      posted: "4d ago",
      logo: "https://media.licdn.com/dms/image/v2/C4E12AQHasg8Nke_HTQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1581342668750?e=2147483647&v=beta&t=TxVvk00GYdXtGrUNRWhfSGHrmgmQ-8SK7ySm7CmDyd8",
    },
    {
      id: 8,
      title: "Mobile App Developer",
      company: "AppCraft",
      location: "Colombo, Sri Lanka",
      type: "Full-time",
      posted: "3d ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Google-flutter-logo.png",
    },
  ]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <Box sx={{ width: { xs: "100%", md: "100%" } }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        <WorkOutlineIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Find Your Next Opportunity
      </Typography>

      {/* Search bar */}
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
          <Grid item xs={12} md={6} key={job.id}>
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
                  backgroundColor: "#fafafa", // light background for logos
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={job.logo}
                  alt={`${job.company} Logo`}
                   
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
                      Posted {job.posted}
                    </Typography>
                  </Box>

                  {/* Save job button */}
                  <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                    <BookmarkBorderIcon sx={{ color: "#5e5e5e" }} />
                  </IconButton>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={1}>
                  <Chip label={job.type} size="small" color="primary" />
                </Stack>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    fullWidth
                    sx={{ textTransform: "none", borderRadius: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobClick(job.id);
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
