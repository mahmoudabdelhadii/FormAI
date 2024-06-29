// utility/axios/axiosIntance.ts
import axiosInstance from './axiosIntance';
import { Store } from 'redux';
import { refreshToken as refreshReduxToken } from '../../state-managment/slices/tokenSlice';
import { RootState, AppDispatch } from '../../state-managment/store';

const attachTokenToRequest = (store: Store<RootState>) => (config: any) => {
  const state = store.getState();
  const accessToken = state.token.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

// Handle response errors
const handleResponseError = (store: Store<RootState>, error: any) => async (originalRequest: any) => {
  if (!error.response) {
    console.error('Network error or server is down:', error.message);
    return Promise.reject(error);
  }

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

// Setup interceptors
export const setupInterceptors = (store: Store<RootState>) => {
  axiosInstance.interceptors.request.use(attachTokenToRequest(store), (error) => Promise.reject(error));

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => handleResponseError(store, error)(error.config)
  );
};
