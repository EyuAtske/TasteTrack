import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // Will be proxying to the backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // FormData (file uploads) must NOT be sent as JSON. With the default
    // 'application/json' header, axios converts the FormData to JSON and the
    // files are lost. Removing the header lets the browser set multipart/form-data.
    if (config.data instanceof FormData) {
      if (typeof config.headers.setContentType === 'function') {
        config.headers.setContentType(undefined);
      }
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors (like 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., clear token and redirect to login)
      localStorage.removeItem('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;