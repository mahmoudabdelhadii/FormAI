import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state-managment/store";
import { loadToken, refreshToken } from "../state-managment/slices/tokenSlice";
import { isTokenExpired } from "../utility/tokenUtils"; // Make sure you have this utility function

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, accessTokenExpiresAt, status } = useSelector((state: RootState) => state.token);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isAuthenticated = !!accessToken && status === "succeeded";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const resultAction = await dispatch(loadToken());
        if (loadToken.fulfilled.match(resultAction)) {
          const { accessToken, accessTokenExpiresAt } = resultAction.payload;
          if (accessToken && !isTokenExpired(accessTokenExpiresAt)) {
            console.log("Stored access token found and is valid.");
          } else if (accessToken && isTokenExpired(accessTokenExpiresAt)) {
            console.log("Stored access token found but is expired, attempting refresh...");
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

  return { accessToken, status, isCheckingAuth, isAuthenticated };
};

export default useAuth;
