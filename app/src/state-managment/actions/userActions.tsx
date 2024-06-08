import {
  USER_LOGIN_ERROR,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
} from "./actionTypes";

export const userLoginSuccess = (userData: any) => ({
  type: USER_LOGIN_SUCCESS,
  payload: userData,
});

export const userLoginError = (error: any) => ({
  type: USER_LOGIN_ERROR,
  payload: error,
});

export const userLogout = () => ({
  type: USER_LOGOUT,
});
