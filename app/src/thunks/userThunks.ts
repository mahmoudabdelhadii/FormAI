import { AppDispatch, RootState } from "../state-managment/store";
import { setLoading, setUser, setError } from "../state-managment/slices/userSlice";
import type { User } from "../schemas/userSchema";
import axiosInstance from "../utility/axios/axiosIntance";
import { setToken } from "../state-managment/slices/tokenSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  communities?: string[];
  message?: string;
}

export const userLogin = (
  email: string,
  password: string
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams();
      params.append('identifier', email);
      params.append('password', password);
      const response = await axiosInstance.post<LoginResponse>('/user/signin', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = response.data;
      if (data.accessToken && data.refreshToken) {
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        dispatch(setUser({ user: data.user!, communities: data.communities || [] })); // Ensure communities is an array
        dispatch(setToken({
          accessToken: data.accessToken, refreshToken: data.refreshToken,
          accessTokenExpiresAt: data.accessTokenExpiresAt,
          refreshTokenExpiresAt: data.refreshTokenExpiresAt
        }));
        dispatch(setLoading(false));
        return { success: true, user: data.user, communities: data.communities };
      } else {
        dispatch(setError(data.message || "Login failed"));
        dispatch(setLoading(false));
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || error.message || "Login failed"));
      dispatch(setLoading(false));
      return { success: false, message: error.response?.data?.message || error.message || "Login failed" };
    }
  };
};

const MAX_RETRY = 3;

export const refreshToken = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { refreshToken } = getState().token;
    let retryCount = 0;

    const tryRefreshToken = async (): Promise<boolean> => {
      try {
        const response = await axiosInstance.post('/user/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        dispatch(setToken({
          accessToken, refreshToken: newRefreshToken,
          accessTokenExpiresAt: "",
          refreshTokenExpiresAt: ""
        }));
        return true;
      } catch (error: any) {
        retryCount++;
        if (retryCount >= MAX_RETRY) {
          dispatch(setError('Failed to refresh token after maximum retries'));
          return false;
        }
        return tryRefreshToken();
      }
    };

    return tryRefreshToken();
  };
};
