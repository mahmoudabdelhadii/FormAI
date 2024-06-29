import axiosInstance from './axiosIntance';
import { Store } from 'redux';
import { refreshToken as refreshReduxToken } from '../../state-managment/slices/tokenSlice';
import { RootState, AppDispatch } from '../../state-managment/store';

// Attach access token to request if available
const attachTokenToRequest = (store: Store<RootState>) => (config: any) => {
  const state = store.getState();
  const accessToken = state.token.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

// Handle response errors, specifically 401 errors to refresh token
const handleResponseError = (store: Store<RootState>, error: any) => async (originalRequest: any) => {
  if (!error.response) {
    console.error('Network error or server is down:', error.message);
    return Promise.reject(error);
  }

  // If 401 error, attempt to refresh the token
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const result = await (store.dispatch as AppDispatch)(refreshReduxToken());

    if (refreshReduxToken.fulfilled.match(result)) {
      const state = store.getState();
      const newAccessToken = state.token.accessToken;

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    } else {
      console.error('Failed to refresh token');
      return Promise.reject(result.error);
    }
  }

  return Promise.reject(error);
};

// Setup interceptors for axios instance
export const setupInterceptors = (store: Store<RootState>) => {
  // Attach token to requests
  axiosInstance.interceptors.request.use(attachTokenToRequest(store), (error) => Promise.reject(error));

  // Handle response errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => handleResponseError(store, error)(error.config)
  );
};
