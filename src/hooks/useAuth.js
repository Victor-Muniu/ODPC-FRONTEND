import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  getTimeUntilExpiration,
  isTokenExpiringSoon,
  logout as authLogout,
  getUserInfo,
  getUserRole,
} from "../utils/Auth";

export const useAuth = () => {
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(null);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    authLogout();
    setIsValid(false);
    navigate("/", { replace: true });
  }, [navigate]);

  const checkTokenStatus = useCallback(() => {
    const authenticated = isAuthenticated();
    const timeLeft = getTimeUntilExpiration();
    const expiringSoon = isTokenExpiringSoon(5); // 5 minutes threshold

    setIsValid(authenticated);
    setTimeUntilExpiry(timeLeft);
    setIsExpiringSoon(expiringSoon);
    setIsLoading(false);

    if (!authenticated) {
      logout();
      return false;
    }

    return true;
  }, [logout]);

  useEffect(() => {
    // Initial check
    checkTokenStatus();

    // Set up periodic checks
    const interval = setInterval(() => {
      checkTokenStatus();
    }, 60000); // Check every minute

    // Listen for logout events
    const handleLogout = () => {
      setIsValid(false);
      navigate("/", { replace: true });
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      clearInterval(interval);
      window.removeEventListener("logout", handleLogout);
    };
  }, [checkTokenStatus, navigate]);

  return {
    isValid,
    isLoading,
    timeUntilExpiry,
    isExpiringSoon,
    logout,
    checkTokenStatus,
    userInfo: getUserInfo(),
    userRole: getUserRole(),
  };
};

export default useAuth;
