import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { loadingReducer } from "./slices/loadingSlice";
import tokenReducer from "./slices/tokenSlice";
import communitiesReducer from "./slices/communitySlice";
import { setupInterceptors } from "../utility/axios/axiosInterceptors";
import { composeWithDevTools } from "@redux-devtools/extension";
import logger from "redux-logger";
const store = configureStore({
  reducer: {
    user: userReducer,
    isLoading: loadingReducer,
    token: tokenReducer,
    communities: communitiesReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

setupInterceptors(store);

export default store;

export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
