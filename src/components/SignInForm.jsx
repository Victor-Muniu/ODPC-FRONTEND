import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export const SignInForm = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState("credentials")
  const [formData, setFormData] = useState({ username: "", password: "", otp: "" })
  const [userId, setUserId] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState({ type: null, message: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState({ type: null, message: "" })

  const validateCredentials = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateOTP = () => {
    const newErrors = {}

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required"
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must be 6 digits"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCredentialsSubmit = async () => {
    if (!validateCredentials()) return

    setIsLoading(true)
    setLoginStatus({ type: null, message: "" })

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      })

      const result = await response.json()

      if (response.ok) {
        setUserId(result.userId)
        setCurrentStep("otp")
        setLoginStatus({
          type: "info",
          message: result.message || "OTP has been sent to your email. Please check your inbox.",
        })
      } else {
        setLoginStatus({ type: "error", message: result.message || "Invalid credentials. Please try again." })
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginStatus({ type: "error", message: "Network error. Please check your connection and try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async () => {
    if (!validateOTP()) return

    setIsLoading(true)
    setLoginStatus({ type: null, message: "" })

    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, otp: formData.otp }),
      })

      const result = await response.json()

      if (response.ok) {
        setLoginStatus({ type: "success", message: result.message || "Login successful! Redirecting…" })
        localStorage.setItem("authToken", result.token)
        setTimeout(() => {
          onSubmit && onSubmit(result.token)
        }, 1500)
      } else {
        setLoginStatus({ type: "error", message: result.message || "Invalid OTP. Please try again." })
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      setLoginStatus({ type: "error", message: "Network error. Please check your connection and try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (currentStep === "credentials") {
      await handleCredentialsSubmit()
    } else {
      await handleOTPSubmit()
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    if (loginStatus.type) {
      setLoginStatus({ type: null, message: "" })
    }
  }

  const handleBackToCredentials = () => {
    setCurrentStep("credentials")
    setUserId("")
    setFormData((prev) => ({ ...prev, otp: "" }))
    setErrors({})
    setLoginStatus({ type: null, message: "" })
  }

  const resendOTP = async () => {
    setIsLoading(true)
    setLoginStatus({ type: null, message: "" })

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      })

      if (response.ok) {
        setLoginStatus({ type: "info", message: "New OTP has been sent to your email." })
      } else {
        setLoginStatus({ type: "error", message: "Failed to resend OTP. Please try again." })
      }
    } catch (error) {
      setLoginStatus({ type: "error", message: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()

    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordStatus({ type: "error", message: "Email is required" })
      return
    }

    if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setForgotPasswordStatus({ type: "error", message: "Please enter a valid email address" })
      return
    }

    setIsLoading(true)
    setForgotPasswordStatus({ type: null, message: "" })

    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      const result = await response.json()

      if (response.ok) {
        setForgotPasswordStatus({
          type: "success",
          message: result.message || "Password reset instructions have been sent to your email.",
        })
        setTimeout(() => {
          setShowForgotPassword(false)
          setForgotPasswordEmail("")
          setForgotPasswordStatus({ type: null, message: "" })
        }, 3000)
      } else {
        setForgotPasswordStatus({
          type: "error",
          message: result.message || "Failed to send reset instructions. Please try again.",
        })
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      setForgotPasswordStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
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
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <div className="error-message">⚠️ {errors.password}</div>}
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Verifying…" : "Sign In"}
            </button>

            <div className="form-footer">
              <button type="button" className="form-link" onClick={() => setShowForgotPassword(true)}>
                Forgot your password?
              </button>
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
            <strong>Security Notice:</strong> After entering your credentials, you will receive an OTP via email for
            additional security.
          </div>
        )}
        {currentStep === "otp" && !loginStatus.type && (
          <div className="security-notice">
            <strong>Two-Factor Authentication:</strong> Please check your email for the 6-digit OTP code. The code is
            valid for 10 minutes. If you don't receive it, check your spam folder or click "Resend OTP".
          </div>
        )}
      </form>

      {showForgotPassword && (
        <div className="forgot-password-overlay">
          <div className="forgot-password-modal">
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotPasswordEmail("")
                  setForgotPasswordStatus({ type: null, message: "" })
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="form-group">
                <label htmlFor="forgotEmail" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  name="forgotEmail"
                  className="form-input"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </button>

              {forgotPasswordStatus.type && (
                <div className={`security-notice ${forgotPasswordStatus.type}`}>
                  <strong>{forgotPasswordStatus.type === "success" ? "Success!" : "Error:"}</strong>{" "}
                  {forgotPasswordStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
