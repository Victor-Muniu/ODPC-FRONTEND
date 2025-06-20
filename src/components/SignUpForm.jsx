import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export const SignUpForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    designation: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [registrationStatus, setRegistrationStatus] = useState({ type: null, message: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

    if (!formData.firstname.trim()) newErrors.firstname = "First name is required"
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required"

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.department.trim()) newErrors.department = "Department is required"
    if (!formData.designation.trim()) newErrors.designation = "Designation is required"

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (passwordStrength < 4) {
      newErrors.password = "Password does not meet security requirements"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setRegistrationStatus({ type: null, message: "" })

    try {
      const registrationData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        department: formData.department,
        designation: formData.designation,
        username: formData.username,
        password: formData.password,
      }
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (response.ok) {
        setRegistrationStatus({ type: "success", message: "Registration successful!" })

        if (result.token) {
          localStorage.setItem("authToken", result.token)
        }
        if (result.refreshToken) {
          localStorage.setItem("refreshToken", result.refreshToken)
        }
        onSubmit && onSubmit(result)
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          department: "",
          designation: "",
          username: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
        })
      } else {
        setRegistrationStatus({ type: "error", message: result.message || "Registration failed. Please try again." })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setRegistrationStatus({ type: "error", message: "Network error. Please check your connection and try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    if (registrationStatus.type) {
      setRegistrationStatus({ type: null, message: "" })
    }
  }

  const getStrengthLabel = (strength) => {
    if (strength <= 1) return "Very Weak"
    if (strength == 2) return "Weak"
    if (strength == 3) return "Fair"
    if (strength == 4) return "Good"
    if (strength == 5) return "Strong"
    return ""
  }

  const getStrengthClass = (strength) => {
    if (strength <= 2) return "weak"
    if (strength <= 3) return "medium"
    return "active"
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            className={`form-input ${errors.firstname ? "error" : ""}`}
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="Enter first name"
            autoComplete="given-name"
          />
          {errors.firstname && <div className="error-message">⚠️ {errors.firstname}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="lastname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            className={`form-input ${errors.lastname ? "error" : ""}`}
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Enter last name"
            autoComplete="family-name"
          />
          {errors.lastname && <div className="error-message">⚠️ {errors.lastname}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Official Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-input ${errors.email ? "error" : ""}`}
          value={formData.email}
          onChange={handleInputChange}
          placeholder="name@organization.go.ke"
          autoComplete="email"
        />
        {errors.email && <div className="error-message">⚠️ {errors.email}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="department" className="form-label">
            Department
          </label>
          <select
            id="department"
            name="department"
            className={`form-input ${errors.department ? "error" : ""}`}
            value={formData.department}
            onChange={handleInputChange}
          >
            <option value="">Select Department</option>
            <option value="Legal Affairs">Legal Affairs</option>
            <option value="Compliance & Enforcement">Complaints Investigation & Enforcement</option>
            <option value="Policy & Research">Policy & Research</option>
            <option value="Investigations">Drivers</option>
            <option value="Public Relations">Public Relations</option>
            <option value="Administration">Administration</option>
            <option value="Finance & Procurement">Finance & Procurement</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Other">Other</option>
          </select>
          {errors.department && <div className="error-message">⚠️ {errors.department}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="designation" className="form-label">
            Designation
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            className={`form-input ${errors.designation ? "error" : ""}`}
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="Enter your job title/designation"
            autoComplete="organization-title"
          />
          {errors.designation && <div className="error-message">⚠️ {errors.designation}</div>}
        </div>
      </div>

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
          placeholder="Choose a unique username"
          autoComplete="username"
        />
        {errors.username && <div className="error-message">⚠️ {errors.username}</div>}
      </div>

      <div className="form-row">
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
              placeholder="Create a secure password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formData.password && (
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
                Strength: {getStrengthLabel(passwordStrength)} • Must contain uppercase, lowercase, numbers, and special
                characters
              </div>
            </div>
          )}
          {errors.password && <div className="error-message">⚠️ {errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="error-message">⚠️ {errors.confirmPassword}</div>}
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading && <span className="loading-spinner"></span>}
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      {registrationStatus.type && (
        <div className={`security-notice ${registrationStatus.type}`}>
          <strong>{registrationStatus.type === "success" ? "Success!" : "Registration Failed:"}</strong>{" "}
          {registrationStatus.message}
        </div>
      )}

      {!registrationStatus.type && (
        <div className="security-notice">
          <strong>Application Review Process:</strong> Your account will be created immediately upon successful
          registration. You will receive authentication tokens that allow you to access the Data Protection
          Commissioner's secure portal.
        </div>
      )}
    </form>
  )
}
