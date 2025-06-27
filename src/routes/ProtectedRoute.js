import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, decodeToken } from "../utils/Auth";

const ProtectedRoute = ({ element }) => {
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");

    // Clear any other stored user data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("user") || key.startsWith("auth"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Navigate to login page
    navigate("/", { replace: true });
  };

  const checkTokenValidity = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsTokenValid(false);
      setIsLoading(false);
      return false;
    }

    // Check if token is valid and not expired
    if (!isAuthenticated()) {
      console.log("Token expired or invalid, logging out...");
      handleLogout();
      return false;
    }

    // Check token expiration time and set up warning
    const decoded = decodeToken(token);
    if (decoded && decoded.exp) {
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;

      // If token expires in less than 5 minutes, show warning
      if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
        console.warn(
          `Token expires in ${Math.floor(timeUntilExpiry / 60)} minutes`,
        );

        // Optional: Show user notification about upcoming expiration
        // You can uncomment this if you want to show an alert
        // alert(`Your session will expire in ${Math.floor(timeUntilExpiry / 60)} minutes. Please save your work.`);
      }
    }

    setIsTokenValid(true);
    setIsLoading(false);
    return true;
  };

  useEffect(() => {
    // Initial token check
    checkTokenValidity();

    // Set up periodic token validation (check every minute)
    const tokenCheckInterval = setInterval(() => {
      checkTokenValidity();
    }, 60000); // 60 seconds

    // Set up more frequent checks as expiration approaches
    const frequentCheckInterval = setInterval(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.exp) {
          const currentTime = Date.now() / 1000;
          const timeUntilExpiry = decoded.exp - currentTime;

          // If less than 5 minutes remaining, check every 10 seconds
          if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
            checkTokenValidity();
          }
        }
      }
    }, 10000); // 10 seconds

    // Clean up intervals on unmount
    return () => {
      clearInterval(tokenCheckInterval);
      clearInterval(frequentCheckInterval);
    };
  }, []);

  // Set up API response interceptor for 401 errors (token expired)
  useEffect(() => {
    const handleUnauthorized = (event) => {
      // Listen for fetch responses that return 401
      if (event.detail && event.detail.status === 401) {
        console.log("Received 401 Unauthorized, logging out...");
        handleLogout();
      }
    };

    // Add event listener for custom unauthorized events
    window.addEventListener("unauthorized", handleUnauthorized);

    // Intercept fetch requests to handle 401 responses
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (response.status === 401) {
          console.log("API returned 401 Unauthorized, logging out...");
          handleLogout();
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
      window.fetch = originalFetch;
    };
  }, []);

  // Show loading state while checking token
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8fafc",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          Verifying authentication...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // If token is invalid or expired, redirect to login
  if (!isTokenValid) {
    return <Navigate to="/" replace />;
  }

  // If everything is good, render the protected component
  return element;
};

export default ProtectedRoute;
