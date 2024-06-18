// thunks/userThunks.ts
import { AppDispatch } from "../state-managment/store";
import { setLoading, setUser, setError } from "../state-managment/slices/userSlice";
import type { User } from "../schemas/userSchema";
import axiosInstance from "../utility/axios/axiosIntance";
import { setToken } from "../state-managment/slices/tokenSlice";

interface LoginResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  accessTokenUpdatedreshedAt?: string;
  communities?: string[];
  message?: string;
}

export const userLogin = (
  email: string,
  password: string
)=> {
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
    //   console.log(response);
      const data = response.data;
      if (data.accessToken) {

        dispatch(setUser({ user: data.user!, communities: data.communities! }));
        dispatch(setLoading(false));
        dispatch(setToken({ accessToken: data.accessToken, refreshToken: data.refreshToken! })); // Set tokens
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
