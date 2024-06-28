// slices/tokenSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../utility/axios/axiosIntance";
import { fetchUser } from "./userSlice"; // Import the fetchUser thunk

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TokenState = {
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
};

export const loadToken = createAsyncThunk(
  "token/loadToken",
  async (_, { dispatch }) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (accessToken) {
      dispatch(fetchUser()); // Fetch user data if access token is available
    }
    return { accessToken, refreshToken };
  }
);

export const refreshToken = createAsyncThunk(
  "token/refreshToken",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { token: TokenState };
    const refreshToken = state.token.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axiosInstance.post("/user/refresh-token", {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", newRefreshToken);

      dispatch(fetchUser()); // Fetch user data after refreshing token
      return { accessToken, refreshToken: newRefreshToken };
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
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      AsyncStorage.setItem("accessToken", action.payload.accessToken);
      AsyncStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    clearToken: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      AsyncStorage.removeItem("accessToken");
      AsyncStorage.removeItem("refreshToken");
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
          }>
        ) => {
          state.status = "succeeded";
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
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
          action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
          state.status = "succeeded";
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
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
