// JWT token decoder utility
export const decodeToken = (token) => {
    try {
      // JWT tokens have 3 parts separated by dots: header.payload.signature
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  }
  
  export const getUserRole = () => {
    const token = localStorage.getItem("authToken")
    if (!token) return null
  
    const decoded = decodeToken(token)
    return decoded?.role || null
  }
  
  export const getUserInfo = () => {
    const token = localStorage.getItem("authToken")
    if (!token) return null
  
    const decoded = decodeToken(token)
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
    }
  }
  
  export const isAuthenticated = () => {
    const token = localStorage.getItem("authToken")
    if (!token) return false
  
    const decoded = decodeToken(token)
    if (!decoded) return false
  
    // Check if token is expired
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  }
  