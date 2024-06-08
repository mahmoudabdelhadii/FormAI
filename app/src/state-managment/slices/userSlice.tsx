// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../schemas/userSchema";
export interface UserState {
  isLoading: boolean;
  user: User | null;
  communities: string[]; // or another appropriate type
  error: string | null;
}

export interface AppState {
  user: UserState;
  isLoading: boolean;
}
const initialState: UserState = {
  isLoading: false,
  user: null,
  communities: [],
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.communities = action.payload.communities;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.communities = [];
      state.error = null;
    },
  },
});

export const { setLoading, setUser, setError, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
