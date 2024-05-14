import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { loadingReducer } from "./reducers/loadingReducer";

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
