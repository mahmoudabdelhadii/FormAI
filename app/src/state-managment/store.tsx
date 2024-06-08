import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";
import { loadingReducer } from "./slices/loadingSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    isLoading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  any,
  Action<string>
>;
// store.js
