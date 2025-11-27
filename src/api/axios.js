import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:8080', // ✅ Your backend base URL
  baseURL: 'https://nextgencareerhub.site/candidate-service',

});

export default instance;
