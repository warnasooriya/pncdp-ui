import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton,
  Badge,
  CircularProgress,
  Tab,
  Tabs
} from '@mui/material';
import {
  Message as MessageIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  Share as ShareIcon,
  Event as EventIcon,
  VideoLibrary as VideoIcon,
  Timeline as TimelineIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import LoadingOverlay from '../common/LoadingOverlay';
import TopNav from '../Layout/TopNav';
import LeftSidebar from '../Layout/LeftSidebar';
import RightSidebar from '../Layout/RightSidebar';

const ConnectedUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [mutualConnections, setMutualConnections] = useState([]);
  const [otherConnections, setOtherConnections] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchConnectedUserProfile();
      fetchUserPosts();
      fetchUserActivities();
      fetchConnectionData();
    }
  }, [userId]);

  const fetchConnectedUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/candidate/network/profile/${currentUserId}/${userId}`);
      setProfile(response.data.profile);
      setError(null);
    } catch (error) {
      console.error('Error fetching connected user profile:', error);
      setError(error.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await axios.get(`/api/candidate/posts/user/${userId}?requestingUserId=${currentUserId}&limit=10`);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchUserActivities = async () => {
    try {
      setLoadingActivities(true);
      const response = await axios.get(`/api/candidate/activities/user/${userId}?requestingUserId=${currentUserId}&limit=10`);
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('Error fetching user activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchConnectionData = async () => {
    try {
      // Fetch connection count
      const countResponse = await axios.get(`/api/candidate/activities/connections/count/${userId}`);
      setConnectionCount(countResponse.data.connectionCount || 0);

      // Fetch mutual connections and other connections
      const mutualResponse = await axios.get(`/api/candidate/activities/connections/mutual/${currentUserId}/${userId}`);
      setMutualConnections(mutualResponse.data.mutualConnections || []);
      setOtherConnections(mutualResponse.data.otherConnections || []);
    } catch (error) {
      console.error('Error fetching connection data:', error);
    }
  };

  const handleSendMessage = () => {
    // Navigate to messages page with this user
    navigate(`/messages?userId=${userId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="outlined" onClick={handleGoBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Profile not found
        </Typography>
        <Button variant="outlined" onClick={handleGoBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopNav />
      <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />
        
        {/* Center Content */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, mx: 'auto' }}>
          {/* Header with back button */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1">
              Profile
            </Typography>
          </Box>

      {/* Profile Header Card */}
      <Card sx={{ mb: 3 }}>
        {/* Banner Image */}
        {profile.bannerImageUrl && (
          <CardMedia
            component="img"
            height="200"
            image={profile.bannerImageUrl}
            alt="Banner"
            sx={{ objectFit: 'cover' }}
          />
        )}
        
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {/* Profile Image */}
            <Avatar
              src={profile.profileImageUrl}
              alt={profile.fullName}
              sx={{ 
                width: 120, 
                height: 120, 
                border: '4px solid white',
                mt: profile.bannerImageUrl ? -8 : 0
              }}
            />
            
            {/* Profile Info */}
            <Box sx={{ flex: 1, mt: profile.bannerImageUrl ? -4 : 0 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {profile.fullName}
              </Typography>
              
              {profile.headline && (
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {profile.headline}
                </Typography>
              )}
              
              {profile.email && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profile.email}
                </Typography>
              )}
              
              {/* Connection Info */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip 
                    label={`Connected since ${new Date(profile.connectionInfo.connectionDate).toLocaleDateString()}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip 
                    icon={<PeopleIcon />}
                    label={`${connectionCount} connections`}
                    variant="outlined"
                    size="small"
                  />
                  {mutualConnections.length > 0 && (
                    <Chip 
                      label={`${mutualConnections.length} mutual connections`}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>
              </Box>
              
              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<MessageIcon />}
                  onClick={handleSendMessage}
                  color="primary"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Send Message
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Mutual Connections Section */}
      {mutualConnections.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              Mutual Connections ({mutualConnections.length})
            </Typography>
            <Grid container spacing={2}>
              {mutualConnections.map((connection) => (
                <Grid item xs={12} sm={6} md={4} key={connection._id}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                    onClick={() => navigate(`/profile/${connection.userId}`)}
                  >
                    <Avatar 
                      src={connection.profileImage} 
                      alt={connection.fullName}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {connection.fullName}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {connection.headline}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {/* Show other connections if available */}
            {otherConnections.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
                  Other Connections ({otherConnections.length})
                </Typography>
                <Grid container spacing={1}>
                  {otherConnections.slice(0, 6).map((connection) => (
                    <Grid item key={connection._id}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          p: 1,
                          borderRadius: 1,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                        onClick={() => navigate(`/profile/${connection.userId}`)}
                      >
                        <Avatar 
                          src={connection.profileImage} 
                          alt={connection.fullName}
                          sx={{ width: 40, height: 40, mb: 0.5 }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            textAlign: 'center',
                            maxWidth: 60,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {connection.fullName.split(' ')[0]}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                  {otherConnections.length > 6 && (
                    <Grid item>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mb: 0.5,
                            backgroundColor: 'primary.main',
                            fontSize: '0.875rem'
                          }}
                        >
                          +{otherConnections.length - 6}
                        </Avatar>
                        <Typography variant="caption" sx={{ textAlign: 'center' }}>
                          more
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      {profile.about && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {typeof profile.about === 'object' ? profile.about.Description : profile.about}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {profile.experience && profile.experience.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ mr: 1 }} />
              Experience
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {profile.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: index < profile.experience.length - 1 ? 3 : 0 }}>
                <Typography variant="h6" component="h3">
                  {exp.jobTitle}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {exp.company}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {exp.startDate} - {exp.endDate || 'Present'}
                  {exp.location && ` • ${exp.location}`}
                </Typography>
                {exp.description && (
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {exp.description}
                  </Typography>
                )}
                {index < profile.experience.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education Section */}
      {profile.education && profile.education.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1 }} />
              Education
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {profile.education.map((edu, index) => (
              <Box key={index} sx={{ mb: index < profile.education.length - 1 ? 3 : 0 }}>
                <Typography variant="h6" component="h3">
                  {edu.institution}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {edu.startDate} - {edu.endDate || 'Present'}
                </Typography>
                {edu.description && (
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {edu.description}
                  </Typography>
                )}
                {index < profile.education.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications Section */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Certifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {profile.certifications.map((cert, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      {cert.name}
                    </Typography>
                    <Typography variant="body2" color="primary" gutterBottom>
                      {cert.issuingOrganization}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Issued: {cert.issueDate}
                      {cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                    </Typography>
                    {cert.credentialId && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Credential ID: {cert.credentialId}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Section */}
      {profile.portfolio && profile.portfolio.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Portfolio
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {profile.portfolio.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      {item.title}
                    </Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.description}
                      </Typography>
                    )}
                    {item.url && (
                      <Button
                        variant="outlined"
                        size="small"
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 1 }}
                      >
                        View Project
                      </Button>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Posts and Activities Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab 
                icon={<ShareIcon />} 
                label={`Posts (${posts.length})`} 
                iconPosition="start"
              />
              <Tab 
                icon={<TimelineIcon />} 
                label={`Activities (${activities.length})`} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Posts Tab */}
          {activeTab === 0 && (
            <Box>
              {loadingPosts ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : posts.length > 0 ? (
                <Grid container spacing={2}>
                  {posts.map((post) => (
                    <Grid item xs={12} key={post._id}>
                      <Paper sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar 
                            src={post.user.profileImage} 
                            sx={{ width: 40, height: 40, mr: 2 }}
                          >
                            {post.user.fullName?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {post.user.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {post.content}
                        </Typography>
                        
                        {post.mediaUrl && (
                          <Box sx={{ mb: 2 }}>
                            {post.mediaType === 'image' && (
                              <img 
                                src={post.mediaUrl} 
                                alt="Post media"
                                style={{ 
                                  maxWidth: '100%', 
                                  height: 'auto',
                                  borderRadius: '8px'
                                }}
                              />
                            )}
                            {post.mediaType === 'video' && (
                              <video 
                                controls 
                                style={{ 
                                  maxWidth: '100%', 
                                  height: 'auto',
                                  borderRadius: '8px'
                                }}
                              >
                                <source src={post.mediaUrl} />
                              </video>
                            )}
                          </Box>
                        )}
                        
                        <Box display="flex" alignItems="center" gap={2}>
                          <Chip
                            icon={<FavoriteIcon />}
                            label={post.likesCount}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<CommentIcon />}
                            label={post.commentsCount}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<ShareIcon />}
                            label={post.sharesCount}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={4}>
                  <ShareIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No posts yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This user hasn't shared any posts.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Activities Tab */}
          {activeTab === 1 && (
            <Box>
              {loadingActivities ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : activities.length > 0 ? (
                <Grid container spacing={2}>
                  {activities.map((activity) => (
                    <Grid item xs={12} key={activity._id}>
                      <Paper sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Avatar 
                            src={activity.user.profileImage} 
                            sx={{ width: 32, height: 32, mr: 2 }}
                          >
                            {activity.user.fullName?.charAt(0)}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body2">
                              <strong>{activity.user.fullName}</strong> {activity.description}
                            </Typography>
                            <Box display="flex" alignItems="center" mt={0.5}>
                              <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {activity.timeAgo}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={4}>
                  <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No activities yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This user hasn't had any recent activities.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
        </Box>
        
        <RightSidebar />
      </Box>
    </Box>
  );
};

export default ConnectedUserProfile;