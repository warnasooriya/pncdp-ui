import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:3600', // ✅ Your backend base URL
  baseURL: 'https://nextgencareerhub.site/recruiter-service',
});

export default instance;
