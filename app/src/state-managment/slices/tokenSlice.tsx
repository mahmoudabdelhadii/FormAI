import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../utility/axios/axiosIntance";
import { fetchUser } from "./userSlice";
import { isTokenExpired } from "../../utility/tokenUtils";

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TokenState = {
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  status: "idle",
  error: null,
};

export const loadToken = createAsyncThunk(
  "token/loadToken",
  async (_, { dispatch }) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const accessTokenExpiresAt = await AsyncStorage.getItem(
      "accessTokenExpiresAt"
    );
    const refreshTokenExpiresAt = await AsyncStorage.getItem(
      "refreshTokenExpiresAt"
    );

    if (accessToken && !isTokenExpired(accessTokenExpiresAt)) {
      dispatch(fetchUser());
    }

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }
);

export const refreshToken = createAsyncThunk(
  "token/refreshToken",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { token: TokenState };
    const { refreshToken, accessTokenExpiresAt } = state.token;

    if (!refreshToken || !isTokenExpired(accessTokenExpiresAt)) {
      return rejectWithValue("No refresh needed or no refresh token available");
    }

    try {
      const response = await axiosInstance.post("/user/refresh-token", {
        refreshToken,
      });

      const {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      } = response.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", newRefreshToken);
      await AsyncStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt);
      await AsyncStorage.setItem(
        "refreshTokenExpiresAt",
        refreshTokenExpiresAt
      );

      dispatch(fetchUser());

      return {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      };
    } catch (error: any) {
      console.error("Failed to refresh token:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresAt: string;
        refreshTokenExpiresAt: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
      state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt;
      AsyncStorage.setItem("accessToken", action.payload.accessToken);
      AsyncStorage.setItem("refreshToken", action.payload.refreshToken);
      AsyncStorage.setItem(
        "accessTokenExpiresAt",
        action.payload.accessTokenExpiresAt
      );
      AsyncStorage.setItem(
        "refreshTokenExpiresAt",
        action.payload.refreshTokenExpiresAt
      );
    },
    clearToken: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExpiresAt = null;
      state.refreshTokenExpiresAt = null;
      AsyncStorage.removeItem("accessToken");
      AsyncStorage.removeItem("refreshToken");
      AsyncStorage.removeItem("accessTokenExpiresAt");
      AsyncStorage.removeItem("refreshTokenExpiresAt");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        loadToken.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string | null;
            refreshToken: string | null;
            accessTokenExpiresAt: string | null;
            refreshTokenExpiresAt: string | null;
          }>
        ) => {
          state.status = "succeeded";
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
          state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt;
        }
      )
      .addCase(loadToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(
        refreshToken.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresAt: string;
            refreshTokenExpiresAt: string;
          }>
        ) => {
          state.status = "succeeded";
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
          state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt;
        }
      )
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setToken, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
