// thunks/userThunks.ts
import { AppDispatch, AppThunk } from "../state-managment/store";
import { setLoading, setUser, setError } from "../state-managment/slices/userSlice";
import type { User } from "../schemas/userSchema";
import { ThunkAction } from "redux-thunk";
// import { RootState } from "../state-managment/store";

interface LoginResponse {
  success: boolean;
  user?: User;
  communities?: string[];
  message?: string;
}

export const userLogin = (
    email: string,
    password: string
  ): AppThunk<Promise<LoginResponse>> => {
    return async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${process.env.SERVER_BASE_URL}/user/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier:email, password }),
        });
        const data: LoginResponse = await response.json();
        if (data.success) {
          dispatch(setUser({ user: data.user!, communities: data.communities! }));
          dispatch(setLoading(false));
          return { success: true, user: data.user, communities: data.communities };
        } else {
          dispatch(setError(data.message || "Login failed"));
          dispatch(setLoading(false));
          return { success: false, message: data.message || "Login failed" };
        }
      } catch (error:any) {
        dispatch(setError(error.message || "Login failed"));
        dispatch(setLoading(false));
        return { success: false, message: error.message || "Login failed" };
      }
    };
  };