import axios from 'axios';
import useSignupStore from '../store/signup'; // Use Zustand to manage tokens
import Auth from './Auth'; // Token management from Auth object

const authUrls = [
  '/auth/login/',
  '/auth/token/refresh/',
  '/auth/password/reset/',
];

const dashboardViewUrl = '/api/users/dashboard-view/';

const refreshAccessToken = async () => {
  try {
    // Retrieve refresh token from Zustand store or Auth object or localStorage
    const { refreshToken, setAuthToken } = useSignupStore.getState();
    const storedRefreshToken =
      refreshToken || Auth.refreshToken || localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('/auth/token/refresh/', {
      refresh: storedRefreshToken,
    });
    const newAccessToken = response.data.access;

    // Store the new access token in Zustand and localStorage
    setAuthToken(newAccessToken);
const accessTokenKey = 'accessToken';
localStorage.setItem(accessTokenKey, newAccessToken);
Auth.accessToken = newAccessToken;

    return newAccessToken;
  } catch (e) {
    console.error('Failed to refresh access token:', e);
    return null;
  }
};

const ax = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Interceptor for adding authorization token
ax.interceptors.request.use(
  (config) => {
    // Skip adding tokens for certain auth URLs
    if (authUrls.includes(config.url)) {
      return config;
    }

    // Check if the request is for the dashboard-view API
    let token;
    if (config.url === dashboardViewUrl) {
      // Always use the token from Auth for the dashboard-view API
      token = Auth.accessToken;
    } else {
      // For other APIs, get the token from Zustand store, Auth, or localStorage
      const { authToken } = useSignupStore.getState();
      token =
        authToken || Auth.accessToken || localStorage.getItem('accessToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only set Content-Type to application/json if the request data is not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling token expiration and refreshing
ax.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config: originalRequest, response } = error;

    if (response?.status === 503) {
      window.location.href = '/503';
    }

    if (
      originalRequest.url !== '/auth/token/refresh/' &&
      !originalRequest._retry &&
      response?.status === 401
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } else {
        Auth.logout(); // Optional: Handle logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        useSignupStore.getState().resetSignupState(); // Reset Zustand store
      }
    }

    return Promise.reject(error);
  }
);

export default ax;
