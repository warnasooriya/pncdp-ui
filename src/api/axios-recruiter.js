import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:8081', // ✅ Your backend base URL
  baseURL: 'https://nextgencareerhub.site/recruiter-service',
});

export default instance;
