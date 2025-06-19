import React from "react"
import { X, Calendar, User, Building, Shield, FileText } from "lucide-react"
import Logo from "../download.png"
const FormViewModal = ({ form, isOpen, onClose }) => {
  if (!isOpen || !form) return null

  const formatDate = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFieldTypeLabel = (type) => {
    const typeLabels = {
      text: "Text Input",
      email: "Email",
      number: "Number",
      textarea: "Text Area",
      select: "Dropdown",
      checkbox: "Checkbox",
      date: "Date",
      file: "File Upload",
      radio: "Radio Button",
    }
    return typeLabels[type] || type
  }

  const renderPreviewField = (field, index) => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            key={index}
            className="form-preview-input"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
            rows={3}
          />
        )

      case "select":
        return (
          <select key={index} className="form-preview-input" disabled>
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "checkbox":
        return (
          <div key={index} className="checkbox-options-preview">
            {field.options?.map((option, i) => (
              <div key={i} className="checkbox-option">
                <input type="checkbox" id={`modal-checkbox-${index}-${i}`} disabled />
                <label htmlFor={`modal-checkbox-${index}-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        )

      case "radio":
        return (
          <div key={index} className="radio-options-preview">
            {field.options?.map((option, i) => (
              <div key={i} className="radio-option">
                <input type="radio" name={`modal-radio-${index}`} id={`modal-radio-${index}-${i}`} disabled />
                <label htmlFor={`modal-radio-${index}-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        )

      case "file":
        return (
          <div key={index} className="file-preview">
            <div className="file-upload-area">
              <FileText size={24} />
              <span>Click to upload or drag and drop</span>
            </div>
          </div>
        )

      default:
        return (
          <input
            key={index}
            type={field.type}
            className="form-preview-input"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
          />
        )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>Form Preview</h2>
            <p>View form details and structure</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="form-info-section">
            <div className="form-info-header">
              <h3>{form.formName}</h3>
              <div className="form-badges">
                <span className="status-badge published">Published</span>
              </div>
            </div>

            <div className="form-metadata">
              <div className="metadata-item">
                <Building size={16} />
                <span>Department: {form.department}</span>
              </div>
              <div className="metadata-item">
                <Calendar size={16} />
                <span>Created: {formatDate(form.createdAt)}</span>
              </div>
              <div className="metadata-item">
                <FileText size={16} />
                <span>Fields: {form.fields.length}</span>
              </div>
            </div>
          </div>

          <div className="approvers-section">
            <h4>
              <Shield size={18} />
              Approval Workflow
            </h4>
            <div className="approvers-list-view">
              {form.approvers.map((approver, index) => (
                <div key={index} className="approver-card">
                  <User size={16} />
                  <span>{approver.role}</span>
                </div>
              ))}
              {form.approvers.length === 0 && <p className="no-approvers">No approvers configured</p>}
            </div>
          </div>

          <div className="form-preview-section">
            <h4>
              <FileText size={18} />
              Form Structure
            </h4>
            <div className="form-preview-container">
              <div className="form-header-preview">
                <div className="form-logo-section">
                  <img src={Logo} alt="ODPC Logo" className="form-logo" />
                  <div className="form-org-info">
                    <h4>Office of the Data Protection Commissioner</h4>
                    <p>Republic of Kenya</p>
                  </div>
                </div>
                <div className="form-title-section">
                  <h3>{form.formName}</h3>
                  <p className="form-subtitle">Please fill out all required fields below</p>
                </div>
              </div>

              {form.fields.map((field, index) => (
                <div key={index} className="form-field-preview">
                  <div className="field-info">
                    <label className="field-label">{field.label}</label>
                    <span className="field-type">{getFieldTypeLabel(field.type)}</span>
                  </div>
                  {renderPreviewField(field, index)}
                </div>
              ))}

              {form.fields.length === 0 && (
                <div className="no-fields">
                  <FileText size={48} />
                  <p>No fields configured</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary">
            <FileText size={16} />
            Export Form
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormViewModal
