// JWT token decoder utility
export const decodeToken = (token) => {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.role || null;
};

export const getUserInfo = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const decoded = decodeToken(token);
  return {
    uid: decoded?.uid,
    email: decoded?.email,
    role: decoded?.role,
    firstname: decoded?.firstname,
    lastname: decoded?.lastname,
    fullName:
      decoded?.firstname && decoded?.lastname
        ? `${decoded.firstname} ${decoded.lastname}`
        : decoded?.firstname || decoded?.lastname || "User",
    department: decoded?.department,
    iat: decoded?.iat,
    exp: decoded?.exp,
  };
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

export const getTokenExpirationTime = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;

  return decoded.exp * 1000; // Convert to milliseconds
};

export const getTimeUntilExpiration = () => {
  const expirationTime = getTokenExpirationTime();
  if (!expirationTime) return null;

  const currentTime = Date.now();
  const timeUntilExpiry = expirationTime - currentTime;

  return timeUntilExpiry > 0 ? timeUntilExpiry : 0;
};

export const isTokenExpiringSoon = (minutesThreshold = 5) => {
  const timeUntilExpiry = getTimeUntilExpiration();
  if (!timeUntilExpiry) return false;

  const thresholdMs = minutesThreshold * 60 * 1000;
  return timeUntilExpiry < thresholdMs && timeUntilExpiry > 0;
};

export const logout = () => {
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

  // Dispatch custom event for logout
  window.dispatchEvent(new CustomEvent("logout"));
};
