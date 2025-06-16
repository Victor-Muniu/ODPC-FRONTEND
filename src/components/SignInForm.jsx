import React, { useState } from "react"

export const SignInForm = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState("credentials")
  const [formData, setFormData] = useState({ username: "", password: "", otp: "", rememberMe: false })
  const [userId, setUserId] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState({ type: null, message: '' });

  const validateCredentials = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const validateOTP = () => {
    const newErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleCredentialsSubmit = async () => {
    if (!validateCredentials()) return;

    setIsLoading(true);
    setLoginStatus({ type: null, message: '' });

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });

      const result = await response.json();

      if (response.ok) {
        setUserId(result.userId);
        setCurrentStep("otp");
        setLoginStatus({ type: "info", message: result.message || "OTP has been sent to your email. Please check your inbox." });
      } else {
        setLoginStatus({ type: "error", message: result.message || "Invalid credentials. Please try again." });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus({ type: "error", message: "Network error. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOTPSubmit = async () => {
    if (!validateOTP()) return;

    setIsLoading(true);
    setLoginStatus({ type: null, message: '' });

    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, otp: formData.otp })
      });

      const result = await response.json();

      if (response.ok) {
        setLoginStatus({ type: "success", message: result.message || "Login successful! Redirecting…" });
        localStorage.setItem("authToken", result.token);
        setTimeout(() => {
          onSubmit && onSubmit(result.token);
        }, 1500);
      } else {
        setLoginStatus({ type: "error", message: result.message || "Invalid OTP. Please try again." });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setLoginStatus({ type: "error", message: "Network error. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === "credentials") {
      await handleCredentialsSubmit()
    } else {
      await handleOTPSubmit()
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (loginStatus.type) {
      setLoginStatus({ type: null, message: '' })
    }
  }

  const handleBackToCredentials = () => {
    setCurrentStep("credentials")
    setUserId("")
    setFormData((prev) => ({ ...prev, otp: '' }))
    setErrors({});
    setLoginStatus({ type: null, message: '' })
  }

  const resendOTP = async () => {
    setIsLoading(true);
    setLoginStatus({ type: null, message: '' });

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });

      if (response.ok) {
        setLoginStatus({ type: "info", message: "New OTP has been sent to your email." });
      } else {
        setLoginStatus({ type: "error", message: "Failed to resend OTP. Please try again." });
      }
    } catch (error) {
      setLoginStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {currentStep === "credentials" ? (
        <>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-input ${errors.username ? "error" : ""}`}
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              autoComplete="username"
            />
            {errors.username && <div className="error-message">⚠️ {errors.username}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && <div className="error-message">⚠️ {errors.password}</div>}
          </div>

          <div className="checkbox-container">
            <div className="custom-checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
            </div>
            <label htmlFor="rememberMe" className="checkbox-label">
              Keep me signed in on this device
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Verifying…" : "Sign In"}
          </button>

          <div className="form-footer">
            <a href="#" className="form-link">
              Forgot your password?
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="otp" className="form-label">
              Enter OTP Code
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              className={`form-input ${errors.otp ? "error" : ""}`}
              value={formData.otp}
              onChange={handleInputChange}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              autoComplete="one-time-code"
              style={{ textAlign: "center", fontSize: "24px", letterSpacing: "8px" }}
            />
            {errors.otp && <div className="error-message">⚠️ {errors.otp}</div>}
            <div className="success-message" style={{ marginTop: "8px", fontSize: "13px", color: "#64748b" }}>
              📧 OTP has been sent to your registered email address
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Verifying…" : "Verify & Sign In"}
          </button>

          
        </>
      )}

      {loginStatus.type && (
        <div className={`security-notice ${loginStatus.type}`}>
          <strong>
            {loginStatus.type === "success"
              ? "Success!"
              : loginStatus.type === "error"
                ? "Authentication Failed:"
                : "Information:"}
          </strong>{" "}
          {loginStatus.message}
        </div>
      )}

      {currentStep === "credentials" && !loginStatus.type && (
        <div className="security-notice">
          <strong>Security Notice:</strong> After entering your credentials, you will receive an OTP via email for additional security.
        </div>)
      }
      {currentStep === "otp" && !loginStatus.type && (
        <div className="security-notice">
          <strong>Two-Factor Authentication:</strong> Please check your email for the 6-digit OTP code. The code is valid for 10 minutes. If you don't receive it, check your spam folder or click "Resend OTP".
        </div>)
      }
    </form>
  )
};

