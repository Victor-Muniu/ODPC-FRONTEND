"use client"

import { useState, useEffect } from "react"
import { RefreshCw, FileText, Send, ArrowLeft } from "lucide-react"
import SignatureField from "../forms/SignatureField"
import { getUserInfo } from "../utils/Auth"

const PublicFormPage = () => {
  const [forms, setForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:5000/forms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setForms(data.forms || [])
    } catch (err) {
      console.error("Error fetching forms:", err)
      setError("Failed to load forms. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const submitForm = async (formSlug, formData) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`http://localhost:5000/submit/${formSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setSubmitSuccess(true)
      setFormData({})

      // Show success message for 3 seconds then go back to form list
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedForm(null)
      }, 3000)

      return result
    } catch (err) {
      console.error("Error submitting form:", err)
      throw new Error("Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleCheckboxChange = (fieldName, option, checked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldName] || []
      if (checked) {
        return {
          ...prev,
          [fieldName]: [...currentValues, option],
        }
      } else {
        return {
          ...prev,
          [fieldName]: currentValues.filter((val) => val !== option),
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedForm) return

    try {
      await submitForm(selectedForm.slug, formData)
    } catch (error) {
      setError(error.message)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown"
    const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const autoPopulateUserData = (form) => {
    const userInfo = getUserInfo()
    if (!userInfo) return {}

    const autoFilledData = {}

    // Map common field names to user info
    const fieldMappings = {
      first_name: userInfo.firstname,
      last_name: userInfo.lastname,
      job_title: userInfo.role,
      department: userInfo.department,
      email: userInfo.email,
      user_email: userInfo.email,
      requester_email: userInfo.email,
      employee_name: userInfo.fullName,
      full_name: userInfo.fullName,
      name: userInfo.fullName,
    }

    // Auto-fill matching fields
    form.fields?.forEach((field) => {
      const fieldName = field.name || field.label.toLowerCase().replace(/\s+/g, "_")
      if (fieldMappings[fieldName]) {
        autoFilledData[fieldName] = fieldMappings[fieldName]
      }
    })

    // Auto-fill current date for request_date fields
    const currentDate = new Date().toISOString().split("T")[0]
    form.fields?.forEach((field) => {
      const fieldName = field.name || field.label.toLowerCase().replace(/\s+/g, "_")
      if (fieldName.includes("request_date") || fieldName.includes("date_of_request")) {
        autoFilledData[fieldName] = currentDate
      }
    })

    return autoFilledData
  }

  const renderField = (field, index) => {
    const fieldName = field.name || field.label.toLowerCase().replace(/\s+/g, "_")
    const fieldValue = formData[fieldName] || ""

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={index} className="dynamic-form-field">
            <label>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
            <input
              type={field.type}
              className="dynamic-form-input"
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        )

      case "textarea":
        return (
          <div key={index} className="dynamic-form-field">
            <label>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
            <textarea
              className="dynamic-form-textarea"
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              required={field.required}
              rows={4}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        )

      case "date":
        return (
          <div key={index} className="dynamic-form-field">
            <label>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
            <input
              type="date"
              className="dynamic-form-input"
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              required={field.required}
            />
          </div>
        )

      case "select":
        return (
          <div key={index} className="dynamic-form-field">
            <label>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
            <select
              className="dynamic-form-select"
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )

      case "checkbox":
        return (
          <div key={index} className="dynamic-form-field">
            <label>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
            <div className="checkbox-group">
              {field.options?.map((option, i) => (
                <div key={i} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`${fieldName}_${i}`}
                    checked={(formData[fieldName] || []).includes(option)}
                    onChange={(e) => handleCheckboxChange(fieldName, option, e.target.checked)}
                  />
                  <label htmlFor={`${fieldName}_${i}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        )

      case "radio":
        return (
          <div key={index} className="dynamic-form-field">
            <label>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
            <div className="radio-group">
              {field.options?.map((option, i) => (
                <div key={i} className="radio-item">
                  <input
                    type="radio"
                    id={`${fieldName}_${i}`}
                    name={fieldName}
                    value={option}
                    checked={fieldValue === option}
                    onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    required={field.required}
                  />
                  <label htmlFor={`${fieldName}_${i}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        )

      case "signature":
        return (
          <div key={index} className="dynamic-form-field">
            <SignatureField
              label={field.label}
              value={fieldValue}
              onChange={(value) => handleInputChange(fieldName, value)}
              required={field.required}
            />
          </div>
        )

      case "declaration":
        return (
          <div key={index} className="dynamic-form-field">
            <div className="declaration-field">
              <h4>{field.label}</h4>
              <div className="declaration-content">
                <p>{field.content}</p>
              </div>
              <div className="declaration-checkbox">
                <input
                  type="checkbox"
                  id={fieldName}
                  checked={fieldValue || false}
                  onChange={(e) => handleInputChange(fieldName, e.target.checked)}
                  required={field.required}
                />
                <label htmlFor={fieldName}>I agree to the above declaration</label>
              </div>
            </div>
          </div>
        )

      case "info":
        return (
          <div key={index} className="dynamic-form-field">
            <div className="info-field">
              <h4>{field.label}</h4>
              {field.text && (
                <div className="info-content">
                  {field.text.map((item, i) => (
                    <p key={i}>{item}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case "static":
        return (
          <div key={index} className="dynamic-form-field">
            <div className="info-field">
              <h4>{field.label}</h4>
              <p>{field.content}</p>
            </div>
          </div>
        )

      case "file":
        return (
          <div key={index} className="dynamic-form-field">
            <label>
              {field.label}
              {field.required && <span className="required-indicator">*</span>}
            </label>
            <input
              type="file"
              className="dynamic-form-input"
              onChange={(e) => handleInputChange(fieldName, e.target.files[0])}
              required={field.required}
            />
          </div>
        )

      default:
        return null
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="form-requests">
        <div className="loading-state">
          <div className="loading-spinner">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <p>Loading available forms...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !selectedForm) {
    return (
      <div className="form-requests">
        <div className="requests-header">
          <div>
            <h2>Available Forms</h2>
            <p>Submit requests and applications through our digital forms</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={fetchForms}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={fetchForms} className="btn-text">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Form submission success state
  if (submitSuccess) {
    return (
      <div className="form-requests">
        <div className="success-state">
          <div className="success-icon">✅</div>
          <h2>Form Submitted Successfully!</h2>
          <p>Your form has been submitted and is now being processed.</p>
          <p>You will be redirected to the forms list shortly...</p>
        </div>
      </div>
    )
  }

  // Individual form view
  if (selectedForm) {
    return (
      <div className="form-requests">
        <div className="requests-header">
          <div>
            <h2>{selectedForm.formName}</h2>
            <p>Please fill out all required fields below</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setSelectedForm(null)
                setFormData({})
                setError(null)
              }}
            >
              <ArrowLeft size={16} />
              Back to Forms
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        <div className="dynamic-form">
          <div className="dynamic-form-header">
            <h1>{selectedForm.formName}</h1>
            <div className="form-meta-info">
              <span>Department: {selectedForm.department}</span>
              <span>Created: {formatDate(selectedForm.createdAt)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="dynamic-form-content">
            {selectedForm.fields.map((field, index) => renderField(field, index))}

            <div className="form-submit-section">
              <button type="submit" className="form-submit-btn" disabled={submitting}>
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Form
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Forms list view
  return (
    <div className="form-requests">
      <div className="requests-header">
        <div>
          <h2>Available Forms</h2>
          <p>Submit requests and applications through our digital forms</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchForms} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="forms-grid">
        {forms.map((form) => (
          <div
            key={form.id}
            className="form-card"
            onClick={() => {
              setSelectedForm(form)
              const autoFilledData = autoPopulateUserData(form)
              setFormData(autoFilledData)
            }}
          >
            <div className="form-card-header">
              <div className="form-status">
                <div className="status-dot" style={{ backgroundColor: "#10b981" }} />
                <span className="status-text">Available</span>
              </div>
              <div className="form-actions">
                <button className="btn-icon" title="Fill Form">
                  <FileText size={16} />
                </button>
              </div>
            </div>
            <div className="form-card-content">
              <h3>{form.formName}</h3>
              <div className="form-meta">
                <span>{form.fields?.length || 0} fields</span>
                <span>Created {formatDate(form.createdAt)}</span>
              </div>
              <div className="form-details">
                <p className="form-department">Department: {form.department}</p>
                <p className="form-approvers">Approvers: {form.approvers?.map((a) => a.role).join(", ") || "None"}</p>
              </div>
            </div>
          </div>
        ))}

        {forms.length === 0 && !loading && (
          <div className="empty-forms-state">
            <FileText size={48} />
            <h3>No forms available</h3>
            <p>There are currently no forms available for submission.</p>
            <button className="btn-primary" onClick={fetchForms}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicFormPage
