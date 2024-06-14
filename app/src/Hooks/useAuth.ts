import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state-managment/store";
import { loadToken, refreshToken } from "../state-managment/slices/tokenSlice";
import { fetchUser } from "../state-managment/slices/userSlice";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, status } = useSelector((state: RootState) => state.token);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const resultAction = await dispatch(loadToken());
        if (loadToken.fulfilled.match(resultAction)) {
          const { accessToken } = resultAction.payload;
          if (accessToken) {
            console.log("Stored access token found, attempting refresh...");
            await dispatch(refreshToken());
          } else {
            console.log("No stored access token found");
          }
        } else {
          console.log("Failed to load tokens from storage");
        }
      } catch (error) {
        console.error("Failed to check authentication status", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (accessToken && status === "succeeded") {
      dispatch(fetchUser());
    }
  }, [accessToken, status, dispatch]);

  useEffect(() => {
    console.log("Authentication status:", accessToken, status);
  }, [accessToken, status]);

  return { accessToken, status, isCheckingAuth };
};

export default useAuth;
