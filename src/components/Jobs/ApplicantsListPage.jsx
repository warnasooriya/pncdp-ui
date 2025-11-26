import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TopNav from "../Layout/TopNav";
import LeftSidebar from "../Layout/LeftSidebar";
import RightSidebar from "../Layout/RightSidebar";
import axios from "../../api/axios-recruiter";
import LoadingOverlay from "../common/LoadingOverlay";
import dayjs from "dayjs";

// -----------------------------
// Helpers
// -----------------------------
const fmt = (n, d = 2) =>
  typeof n === "number" && !Number.isNaN(n) ? n.toFixed(d) : "N/A";

const safeText = (t, fallback = "N/A") =>
  t === null || t === undefined || t === "" ? fallback : String(t);

const dateFmt = (v) =>
  v ? dayjs(v).isValid() && dayjs(v).format("YYYY-MM-DD HH:mm") : "N/A";

const percentify = (v) => {
  if (v == null || Number.isNaN(Number(v))) return null;
  const n = Number(v);
  const p = n <= 1 ? n * 100 : n;
  return Math.max(0, Math.min(100, p));
};

const eduLabel = (lvl) => {
  if (lvl >= 4) return "PhD";
  if (lvl >= 3) return "Master’s";
  if (lvl >= 2) return "Bachelor’s";
  if (lvl >= 1) return "Diploma";
  return "School/Other";
};



const metricFrom = (app) => {
  // search a few likely places for the payload
  const m =
    app?.explanation?.features ||
    {};
  return {
    education_level: m.education_level,
    experience_years: m.experience_years,
    hybrid_score: m.hybrid_score,
    llm_match_score: m.llm_match_score,
    semantic_score: m.semantic_score,
    skill_score: m.skill_score,
    top_negative_factors:
      m.top_negative_factors || app?.explanation?.top_negative_factors || [],
    top_positive_factors:
      m.top_positive_factors || app?.explanation?.top_positive_factors || [],
  };
};

// -----------------------------
// Small UI primitives
// -----------------------------
const FeatureBar = ({ name, weight }) => {
  const magnitude = Math.min(Math.abs(Number(weight) || 0), 1); // clamp 0..1
  return (
    <Box sx={{ mb: 1.25 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {safeText(name)}
        </Typography>
        <Typography variant="body2">
          {Number(weight) >= 0 ? "+" : ""}
          {Number(weight).toFixed(3)}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={magnitude * 100}
        sx={{ height: 8, borderRadius: 10 }}
      />
    </Box>
  );
};

const StatCard = ({ label, value, caption, sx }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      ...sx,
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
      {value}
    </Typography>
    {caption && (
      <Typography variant="caption" color="text.secondary">
        {caption}
      </Typography>
    )}
  </Box>
);

const BarStat = ({ label, raw, suffix = "%", color = "success" }) => {
  const pct = percentify(raw);
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2">
          {pct == null ? "N/A" : `${pct.toFixed(1)}${suffix}`}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct ?? 0}
        sx={{
          height: 8,
          borderRadius: 10,
          "& .MuiLinearProgress-bar": { transition: "transform .4s ease" },
        }}
        color={color}
      />
    </Box>
  );
};

const FactorList = ({ title, items = [], positive = true }) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  const sorted = [...items].sort((a, b) => {
    const av = Number(a?.[1] ?? 0);
    const bv = Number(b?.[1] ?? 0);
    return positive ? bv - av : av - bv;
  });

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {sorted.slice(0, 8).map((it, idx) => {
          const label = Array.isArray(it) ? it[0] : String(it);
          const val = Array.isArray(it) ? Number(it[1]) : 0;
          return (
            <Chip
              key={`${label}-${idx}`}
              size="small"
              variant="outlined"
              color={positive ? "success" : "error"}
              label={`${label} ${val >= 0 ? "+" : ""}${val.toFixed(3)}`}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

// -----------------------------
// Composite: Fit Summary
// -----------------------------
const FitSummary = ({ app }) => {
  const {
     
    education_level,
    experience_years,
    hybrid_score,
    llm_match_score,
    semantic_score,
    skill_score,
    top_negative_factors,
    top_positive_factors,
  } = useMemo(() => metricFrom(app), [app]);

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        background:
          "linear-gradient(180deg, rgba(240,248,255,0.7) 0%, rgba(255,255,255,0.95) 100%)",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "#1976d2" }}>
        Fit Summary
      </Typography>

      <Grid container spacing={2}>
        {/* Left: Key facts */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StatCard
                label="🎓 Education Level"
                value={
                  Number.isFinite(Number(education_level))
                    ? eduLabel(Number(education_level))
                    : "N/A"
                }
                caption={
                  Number.isFinite(Number(education_level))
                    ? `Level ${education_level}`
                    : undefined
                }
                sx={{
                  boxShadow: "0 2px 12px rgba(33,150,243,0.08)",
                  background:
                    Number(education_level) >= 3
                      ? "linear-gradient(135deg, #c8e6c9 0%, #fff 100%)"
                      : "linear-gradient(135deg, #ffcdd2 0%, #fff 100%)",
                  border: "none",
                  color: Number(education_level) >= 3 ? "#388e3c" : "#d32f2f",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                label="💼 Experience"
                value={
                  Number.isFinite(Number(experience_years))
                    ? `${experience_years} yrs`
                    : "N/A"
                }
                caption="Total relevant"
                sx={{
                  boxShadow: "0 2px 12px rgba(255,193,7,0.08)",
                  background:
                    Number(experience_years) >= 5
                      ? "linear-gradient(135deg, #fff9c4 0%, #fff 100%)"
                      : "linear-gradient(135deg, #fce4ec 0%, #fff 100%)",
                  border: "none",
                  color: Number(experience_years) >= 5 ? "#fbc02d" : "#ad1457",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <BarStat
              label="Skill Match -  "
              raw={skill_score}
              color={skill_score >= 0.7 ? "success" : skill_score >= 0.4 ? "warning" : "error"}
              suffix="%"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <BarStat
            label="Hybrid Score -  "
            raw={hybrid_score}
            color={hybrid_score >= 0.7 ? "primary" : hybrid_score >= 0.4 ? "warning" : "error"}
            suffix="%"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <BarStat
            label="LLM Match -  "
            raw={llm_match_score}
            color={llm_match_score >= 0.7 ? "info" : llm_match_score >= 0.4 ? "warning" : "error"}
            suffix="%"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <BarStat
            label="Semantic Match -  "
            raw={semantic_score}
            color={semantic_score >= 0.7 ? "success" : semantic_score >= 0.4 ? "warning" : "error"}
            suffix="%"
          />
        </Grid>
      </Grid>

      <FactorList
        title="Top Positive Factors"
        items={top_positive_factors}
        positive
      />
      <FactorList
        title="Top Negative Factors"
        items={top_negative_factors}
        positive={false}
      />
    </Card>
  );
};

// -----------------------------
// Page Component
// -----------------------------
const ApplicantsListPage = () => {

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [callingApi, setCallingApi] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [query, setQuery] = useState("");
  const [rankingJobId, setRankingJobId] = useState(null);
  const [pollTimer, setPollTimer] = useState(null);
    const [apiResponseStatus ,setApiResponseStatus] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      console.log("API call with:", query);
      setCallingApi(true);
     fetchJobById(id,query);
    }
  };

  const fetchJobById = async (jobId,comment) => {
    try {
      setLoading(true);
      setApiResponseStatus(false);
      const startRes = await axios.post(`/api/recruiter/jobs/ranking/start/${jobId}`, { comment });
      const rid = startRes?.data?.rankingJobId;
       setJob(startRes?.data?.job || {});
      setRankingJobId(rid);
      if (pollTimer) {
        clearInterval(pollTimer);
      }
      const t = setInterval(async () => {
        try {
          const st = await axios.get(`/api/recruiter/jobs/ranking/status/${rid}`);
          const state = st?.data?.state;
          if (state === 'done') {
            setApiResponseStatus(true);
            const res = await axios.get(`/api/recruiter/jobs/ranking/result/${rid}`);
            const data = res?.data || {};
            const sortedList = (data.applications || []).sort((a,b) => (b?.score ?? 0) - (a?.score ?? 0));
            data.applications = sortedList;
            setJob(data);
            clearInterval(t);
            setPollTimer(null);
            setRankingJobId(null);
            setLoading(false);
          } else if (state === 'error') {
            clearInterval(t);
            setPollTimer(null);
            setRankingJobId(null);
            setLoading(false);
          }
        } catch (e) {
          clearInterval(t);
          setPollTimer(null);
          setRankingJobId(null);
          setLoading(false);
        }
      }, 5000);
      setPollTimer(t);
    } catch (error) {
      console.error("Error fetching job:", error);
      setSnackbar({
        open: true,
        message: "Failed to load job details.",
        severity: "error",
      });
    } finally {
      setLoading(false);
       setCallingApi(false);
    }
  };

  const fetchedRef = useRef(false);

  useEffect(() => {
    console.log("Job   callingApi:", callingApi);
    if (id && !fetchedRef.current) {
    fetchedRef.current = true;
      fetchJobById(id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
       <LoadingOverlay isLoading={!apiResponseStatus} />
      <TopNav />

      <Box sx={{ display: "flex", mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />

        {/* Center Content */}
        <Box sx={{ flex: 1 }}>
         

          {/* Shortlisted Candidates */}
          {job?.applications?.length > 0 && (
            <Box mb={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                🏅 Top Shortlisted Candidates
              </Typography>

              {job.applications.map((app, index) => {
                const fullName =
                  app?.usereFullName || app?.userFullName || app?.name || "Candidate";
                const headline = app?.usereHeadline || app?.headline || "";
                const email = app?.usereEail || app?.userEmail || app?.email || "";
                const appliedAt = dateFmt(app?.appliedAt);
                const profileImg = app?.profileImage || app?.avatarUrl || "";
                const resumeUrl = app?.resume || app?.resumeUrl;

                return (
                  <Card
                  key={app?._id || `${fullName}-${index}`}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    p: 0,
                    borderRadius: 3,
                    borderColor: "divider",
                    boxShadow: "0 2px 12px rgba(33,150,243,0.08)",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s",
                    "&:hover": {
                    boxShadow: "0 6px 24px rgba(33,150,243,0.16)",
                    borderColor: "#1976d2",
                    },
                  }}
                  >
                  {/* Header */}
                  <Box
                    sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    }}
                  >
                    <Avatar
                    src={profileImg}
                    alt={fullName}
                    sx={{
                      width: 56,
                      height: 56,
                      boxShadow: "0 2px 8px rgba(33,150,243,0.12)",
                      border: "2px solid #1976d2",
                    }}
                    />
                    <Box flex={1} minWidth={0}>
                    <Typography fontWeight="bold" noWrap sx={{ fontSize: "1.15rem" }}>
                      <span style={{ color: "#1976d2" }}>#{index + 1}</span> {safeText(fullName)}
                      {headline && (
                        <>
                          {" "}– <span style={{ color: "#555", fontWeight: 400 }}>{headline}</span>
                        </>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {email && <>{email} | </>}📅 {appliedAt}
                    </Typography>
                    {resumeUrl && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      📄{" "}
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "underline" }}>
                        View Resume
                      </a>
                      </Typography>
                    )}
                    </Box>
                    <Tooltip title="Model Score">
                    <Chip
                      label={`Score: ${
                      app?.score !== undefined && app?.score !== null
                        ? Number(app?.score).toFixed(2)
                        : (!apiResponseStatus && "Ranking...") || "N/A"
                      }`}
                      color="success"
                      sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      }}
                    />
                    </Tooltip>
                  </Box>

                  {/* Fit Summary */}
                  <Box sx={{ px: 2 }}>
                    <FitSummary app={app} />
                  </Box>
<p></p>
                  {/* Short comment */}
                  {app?.explanation?.explainability?.rank_comment && (
                    <Box sx={{ px: 2, pb: 1 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          bgcolor: Number(app?.score) >= 70 ? "#ade0deff" : "#cdbabaff",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(237, 242, 245, 0.08)",
                          p: 2,
                          mb: 1,
                          borderColor: "#1976d2",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            sx={{
                              bgcolor: "#fefeffff",
                              width: 32,
                              height: 32,
                              fontSize: 18,
                              fontWeight: 700,
                            }}
                          >
                            🧠
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: "#1976d2", fontWeight: 700 }}>
                               Comment
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#444" }}>
                              {app?.explanation?.explainability?.rank_comment}
                            </Typography>
                          </Box>
                        </Stack>
                      </Card>
                    </Box>
                  )}
                  <Accordion sx={{ mt: 1.5, px: 2, background: "#f7fafc" }} disableGutters elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 600 }}>
                      More explainability details
                    </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Grid container spacing={2}>
                      {/* Visuals */}
               

                      {/* Figures / metrics / features */}
                      <Grid item xs={12} md={6}>
                      {app?.explanation?.explainability?.shap_bar_png_base64 && (
                        <Box sx={{ mb: 1 }}>
                        <img
                          src={`data:image/png;base64,${app.explanation.explainability.shap_bar_png_base64}`}
                          alt="Explainability"
                          style={{
                          width: "550px",
                         
                          borderRadius: 8,
                          border: "1px solid rgba(0,0,0,0.08)",
                          boxShadow: "0 2px 8px rgba(33,150,243,0.08)",
                          }}
                        />
                        </Box>
                      )}

                      <Box
                        sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.2,
                        mb: 2,
                        }}
                      >
                        {app?.explanation?.explainability?.confidence != null && (
                        <Chip
                          label={`Confidence: ${fmt(
                          Number(app.explanation.explainability.confidence) * 100,
                          1
                          )}%`}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                        )}
                        {app?.explanation?.explainability?.rank != null && (
                        <Chip
                          label={`Rank: ${app.explanation.explainability.rank}`}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                        )}
                      </Box>

                      <Box>
                        {(app?.explanation?.explainability?.top_features ??
                        app?.explanation?.top_features ??
                        app?.explanation?.lime_weights ??
                        []
                        )
                        .slice(0, 10)
                        .map((f, i) => {
                          const name =
                          f?.name ?? f?.feature ?? f?.[0] ?? `Feature ${i + 1}`;
                          const weight = Number(f?.weight ?? f?.[1] ?? 0);
                          return (
                          <FeatureBar
                            key={`${name}-${i}`}
                            name={name}
                            weight={weight}
                          />
                          );
                        })}
                      </Box>

                      {(app?.explanation?.explainability?.comment_long ||
                        app?.explanation?.comment_long) && (
                        <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Narrative
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {app?.explanation?.explainability?.comment_long ??
                          app?.explanation?.comment_long}
                        </Typography>
                        </Box>
                      )}
                      </Grid>
                    </Grid>
                    </AccordionDetails>
                  </Accordion>
                  </Card>
                );
              })}
            </Box>
          )}

          {/* Ask box */}
          <Box mb={4}>
            <TextField
              label="Ask or add feedback to refine ranking"
              name="description"
              fullWidth
              multiline
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Box>

          {/* Job Card */}
          <Card variant="outlined" sx={{ borderRadius: 3, p: 0, backgroundColor: "white" }}>
            {job?.banner && (
              <Box
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <img
                  src={job?.banner}
                  alt="Job Banner"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            )}

            <CardContent sx={{ p: 3 }}>
              {/* Enhanced Header */}
              <Stack spacing={2} mb={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)",
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(33,150,243,0.08)",
                    p: 2,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={job?.user?.picture || job?.postedBy?.logo}
                      alt={job?.user?.name || job?.postedBy?.name}
                      sx={{
                        width: 72,
                        height: 72,
                        boxShadow: "0 2px 8px rgba(33,150,243,0.12)",
                        border: "2px solid #1976d2",
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                          color: "#1976d2",
                          letterSpacing: 0.5,
                          mb: 0.5,
                        }}
                      >
                        {safeText(job?.title, "Job")}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                        {safeText(job?.user?.name || job?.postedBy?.name, "Publisher")}
                        {" | "}
                        <Chip
                          label={safeText(job?.location, "-")}
                          size="small"
                          color="info"
                          sx={{ ml: 0.5 }}
                        />
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Back">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(-1)}
                        sx={{
                          bgcolor: "#e3f2fd",
                          "&:hover": { bgcolor: "#bbdefb" },
                          borderRadius: 2,
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save to Favorites">
                      <IconButton
                        color="primary"
                        sx={{
                          bgcolor: "#e3f2fd",
                          "&:hover": { bgcolor: "#bbdefb" },
                          borderRadius: 2,
                        }}
                      >
                        <BookmarkBorderIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share Job">
                      <IconButton
                        color="primary"
                        sx={{
                          bgcolor: "#e3f2fd",
                          "&:hover": { bgcolor: "#bbdefb" },
                          borderRadius: 2,
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                <Divider sx={{ mt: 1 }} />
              </Stack>
              {job?.jobType && (
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip label={job?.jobType} size="small" color="primary" />
                </Stack>
              )}

              {/* Description */}
              {job?.description && (
                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    Job Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {job?.description}
                  </Typography>
                </Box>
              )}

              {/* Requirements */}
              {Array.isArray(job?.requirements) && job?.requirements?.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    Requirements
                  </Typography>
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {job?.requirements.map((req, idx) => (
                      <li key={idx}>
                        <Typography variant="body2" color="text.secondary">
                          {req}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {/* Publisher Info */}
              {job?.postedBy && (
                <Box mt={2} mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Published by
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={job?.postedBy?.logo}
                      alt={job?.postedBy?.name}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Typography variant="body1" fontWeight="medium">
                      {safeText(job?.postedBy?.name)}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        <RightSidebar />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ApplicantsListPage;
