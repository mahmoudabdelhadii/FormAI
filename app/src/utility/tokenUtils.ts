// utility/tokenUtils.js
export const isTokenExpired = (expirationTime:string | null) => {
    if (!expirationTime) return true;
    return new Date(expirationTime) <= new Date();
  };
  