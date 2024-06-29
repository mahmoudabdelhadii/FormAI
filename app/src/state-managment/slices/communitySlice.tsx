// src/features/communities/communitiesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Community {
  id: string;
  name?: string;
  description?: string;
  // Add other properties as needed
}

interface CommunitiesState {
  communities: Community[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommunitiesState = {
  communities: [],
  status: "idle",
  error: null,
};

const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    setCommunities: (state, action: PayloadAction<Community[]>) => {
      state.communities = action.payload;
    },
    addCommunity: (state, action: PayloadAction<Community>) => {
      state.communities.push(action.payload);
    },
    updateCommunity: (state, action: PayloadAction<Community>) => {
      const index = state.communities.findIndex(
        (community) => community.id === action.payload.id
      );
      if (index !== -1) {
        state.communities[index] = action.payload;
      }
    },
    deleteCommunity: (state, action: PayloadAction<{ id: string }>) => {
      state.communities = state.communities.filter(
        (community) => community.id !== action.payload.id
      );
    },
  },
});

export const {
  setCommunities,
  addCommunity,
  updateCommunity,
  deleteCommunity,
} = communitiesSlice.actions;

export default communitiesSlice.reducer;
