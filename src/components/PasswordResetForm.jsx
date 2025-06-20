import React, { useState, useEffect } from "react"
import { Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

function PasswordResetForm({ onSuccess}) {
    const navigate = useNavigate()
    const onBackToLogin = () =>{
        
        navigate('/')
    }
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [token, setToken] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [resetStatus, setResetStatus] = useState({ type: null, message: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get("token")

    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setResetStatus({
        type: "error",
        message: "Invalid or missing reset token. Please request a new password reset link.",
      })
    }
  }, [])

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (passwordStrength < 4) {
      newErrors.newPassword = "Password does not meet security requirements"
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!token) {
      newErrors.token = "Reset token is missing or invalid"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setResetStatus({ type: null, message: "" })

    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: formData.newPassword }),
      })

      const result = await response.json()
      if (response.ok) {
        setResetStatus({
          type: "success",
          message: result.message || "Password reset successful! You can now sign in with your new password.",
        })
        setFormData({ newPassword: "", confirmPassword: "" })
        setTimeout(() => { onSuccess && onSuccess() }, 3000)
      } else {
        setResetStatus({
          type: "error",
          message: result.message || "Failed to reset password. Please try again or request a new reset link.",
        })
      }
    } catch (error) {
      console.error("Password reset error:", error)
      setResetStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
    if (resetStatus.type) setResetStatus({ type: null, message: "" })
  }

  const getStrengthLabel = (strength) => {
    return ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength - 1] || ""
  }

  const getStrengthClass = (strength) => {
    if (strength <= 2) return "weak"
    if (strength <= 3) return "medium"
    return "active"
  }

  if (resetStatus.type === "success") {
    return (
      <div className="auth-wrapper">
        <div className="auth-branding">
          <div className="logo-container">
            <div className="agency-logo">
              <img src="/download.png" alt="ODPC Logo" />
            </div>
            <h1 className="agency-title">Data Protection Commissioner</h1>
            <p className="agency-subtitle">Republic of Kenya • Secure Portal Access</p>
          </div>
          <ul className="security-features">
            <li>End-to-end encryption</li>
            <li>Multi-factor authentication</li>
            <li>Audit trail logging</li>
            <li>GDPR compliant</li>
            <li>24/7 security monitoring</li>
          </ul>
        </div>

        <div className="auth-form-container">
          <div className="success-state" style={{ textAlign: "center", padding: "60px 0" }}>
            <CheckCircle size={64} style={{ color: "var(--success-green)", marginBottom: "24px" }} />
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>
              Password Reset Successful!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "32px", lineHeight: "1.6" }}>
              Your password has been successfully updated. You will be redirected to the login page shortly.
            </p>
            <button onClick={onBackToLogin} className="submit-button" style={{ maxWidth: "200px" }}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="auth-wrapper">
    <div className="auth-branding">
      <div className="logo-container">
        <div className="agency-logo">
          <img src="/download.png" alt="ODPC Logo" />
        </div>
        <h1 className="agency-title">Data Protection Commissioner</h1>
        <p className="agency-subtitle">Republic of Kenya • Secure Portal Access</p>
      </div>
      <ul className="security-features">
        <li>End-to-end encryption</li>
        <li>Multi-factor authentication</li>
        <li>Audit trail logging</li>
        <li>GDPR compliant</li>
        <li>24/7 security monitoring</li>
      </ul>
    </div>

    <div className="auth-form-container">
      <div className="form-header">
        <h2 className="form-title">Reset Your Password</h2>
        <p className="form-description">Enter your new password below. Make sure it's strong and secure.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              className={`form-input ${errors.newPassword ? "error" : ""}`}
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              autoComplete="new-password"
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
          {formData.newPassword && (
            <div className="password-strength">
              <div className="strength-indicator">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`strength-bar ${level <= passwordStrength ? getStrengthClass(passwordStrength) : ""}`}
                  />
                ))}
              </div>
              <div className="password-requirements">
                Strength: {getStrengthLabel(passwordStrength)} • Must contain uppercase, lowercase, numbers, and
                special characters
              </div>
            </div>
          )}
          {errors.newPassword && <div className="error-message">⚠️ {errors.newPassword}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
          </label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="error-message">⚠️ {errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading || !token}>
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        <div className="form-footer">
          <button type="button" className="form-link" onClick={onBackToLogin}>
            <ArrowLeft size={16} style={{ marginRight: "8px" }} />
            Back to Login
          </button>
        </div>
      </form>

      {resetStatus.type && (
        <div className={`security-notice ${resetStatus.type}`}>
          <strong>{resetStatus.type === "success" ? "Success!" : "Reset Failed:"}</strong> {resetStatus.message}
        </div>
      )}

      {!resetStatus.type && (
        <div className="security-notice">
          <strong>Security Notice:</strong> Your new password should be unique and not used on other websites. It will
          be encrypted and stored securely.
        </div>
      )}
    </div>
  </div>
  )
}

export default PasswordResetForm
