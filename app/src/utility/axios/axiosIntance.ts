import axios from 'axios';
import Config from 'react-native-config';

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_BASE_URL, // replace with your API base URL
});

export default axiosInstance;
