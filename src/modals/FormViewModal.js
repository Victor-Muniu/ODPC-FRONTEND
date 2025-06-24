import { X, Calendar, Building, Shield, FileText } from "lucide-react"

const FormViewModal = ({ form, isOpen, onClose }) => {
  if (!isOpen || !form) return null

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown"
    const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp)
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
      signature: "Signature",
      info: "Info/Declaration",
      static: "Static Text",
      declaration: "Declaration/Agreement",
    }
    return typeLabels[type] || type
  }

  const getStageLabel = (stage) => {
    const stageLabels = {
      recommendation: "Recommendation",
      issuance: "Issuance",
      approval: "Approval",
      review: "Review",
      verification: "Verification",
      authorization: "Authorization",
    }
    return stageLabels[stage] || stage.charAt(0).toUpperCase() + stage.slice(1)
  }

  const getRoleCriteriaLabel = (criteria) => {
    const roleLabels = {
      hod_or_assistant: "HOD or Assistant",
      ict_officer: "ICT Officer",
      head_of_ict: "Head of ICT",
      finance_officer: "Finance Officer",
      head_of_finance: "Head of Finance",
      hr_officer: "HR Officer",
      head_of_hr: "Head of HR",
      procurement_officer: "Procurement Officer",
      head_of_procurement: "Head of Procurement",
      admin_officer: "Admin Officer",
      head_of_admin: "Head of Admin",
      director: "Director",
      deputy_director: "Deputy Director",
      commissioner: "Commissioner",
    }
    return roleLabels[criteria] || criteria.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const renderFieldPreview = (field, index) => {
    switch (field.type) {
      case "declaration":
        return (
          <div key={index} className="form-field-preview declaration-preview">
            <div className="field-info">
              <span className="field-label">{field.label}</span>
              <span className="field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            <div className="declaration-content-preview">
              <div className="declaration-text">
                <p>{field.content}</p>
              </div>
              <div className="declaration-checkbox-preview">
                <input type="checkbox" disabled />
                <span>I agree to the above declaration</span>
              </div>
            </div>
          </div>
        )

      case "checkbox":
        return (
          <div key={index} className="form-field-preview">
            <div className="field-info">
              <span className="field-label">{field.label}</span>
              <span className="field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            <div className="checkbox-options-preview">
              {field.options?.map((option, i) => (
                <div key={i} className="checkbox-preview">
                  <input type="checkbox" disabled />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "radio":
        return (
          <div key={index} className="form-field-preview">
            <div className="field-info">
              <span className="field-label">{field.label}</span>
              <span className="field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            <div className="radio-options-preview">
              {field.options?.map((option, i) => (
                <div key={i} className="checkbox-preview">
                  <input type="radio" name={`preview-${index}`} disabled />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "select":
        return (
          <div key={index} className="form-field-preview">
            <div className="field-info">
              <span className="field-label">{field.label}</span>
              <span className="field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            <select className="form-preview-input" disabled>
              <option>Select an option...</option>
              {field.options?.map((option, i) => (
                <option key={i}>{option}</option>
              ))}
            </select>
          </div>
        )

      case "textarea":
        return (
          <div key={index} className="form-field-preview">
            <div className="field-info">
              <span className="field-label">{field.label}</span>
              <span className="field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            <textarea className="form-preview-input" placeholder="Text area input..." disabled rows={3} />
          </div>
        )

      case "file":
        return (
          <div key={index} className="form-field-preview">
            <div className="field-info">
              <span className="field-label">{field.label}</span>
              <span className="field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            <div className="file-preview">
              <div className="file-upload-area">
                <FileText size={24} />
                <span>Click to upload file</span>
              </div>
            </div>
          </div>
        )

      case "signature":
        return (
          <div key={index} className="form-field-preview">
            <div className="field-info">
              <span className="field-label">{field.label}</span>
              <span className="field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            <div className="signature-placeholder">Click to sign</div>
          </div>
        )

      case "info":
        return (
          <div key={index} className="form-field-preview">
            <div className="info-field">
              <h4>{field.label}</h4>
              {field.text && (
                <ul>
                  {field.text.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )

      case "static":
        return (
          <div key={index} className="form-field-preview">
            <div className="info-field">
              <h4>{field.label}</h4>
              <p>{field.content}</p>
            </div>
          </div>
        )

      default:
        return (
          <div key={index} className="form-field-preview">
            <div className="field-info">
              <span className="field-label">{field.label}</span>
              <span className="field-type">{getFieldTypeLabel(field.type)}</span>
            </div>
            <input
              type={field.type}
              className="form-preview-input"
              placeholder={`${getFieldTypeLabel(field.type)} input...`}
              disabled
            />
          </div>
        )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>Form Details</h2>
            <p>View form configuration and preview</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="form-info-section">
            <div className="form-info-header">
              <h3>{form.formName}</h3>
              <div className="form-badges">
                <span className={`status-badge ${form.status || "published"}`}>{form.status || "Published"}</span>
              </div>
            </div>

            <div className="form-metadata">
              <div className="metadata-item">
                <Building size={16} />
                <span>Department: {form.department}</span>
              </div>
              <div className="metadata-item">
                <FileText size={16} />
                <span>{form.fields?.length || 0} Fields</span>
              </div>
              <div className="metadata-item">
                <Calendar size={16} />
                <span>Created: {formatDate(form.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Workflow Section */}
          <div className="workflow-section">
            <h4>
              <Shield size={18} />
              Approval Workflow
            </h4>
            {form.workflow && form.workflow.steps && form.workflow.steps.length > 0 ? (
              <div className="workflow-steps-display">
                {form.workflow.steps.map((step, index) => (
                  <div key={index} className="workflow-step-display">
                    <div className="step-indicator">
                      <div className="step-number">{index + 1}</div>
                      <div
                        className="step-line"
                        style={{ display: index === form.workflow.steps.length - 1 ? "none" : "block" }}
                      ></div>
                    </div>
                    <div className="step-details">
                      <div className="step-header">
                        <h5>{getStageLabel(step.stage)}</h5>
                        <span className="step-role">{getRoleCriteriaLabel(step.roleCriteria)}</span>
                      </div>
                      {step.description && <p className="step-description">{step.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-workflow">No workflow configured</p>
            )}
          </div>

          <div className="form-preview-section">
            <h4>
              <FileText size={18} />
              Form Preview
            </h4>
            <div className="form-preview-container">
              {form.fields && form.fields.length > 0 ? (
                form.fields.map((field, index) => renderFieldPreview(field, index))
              ) : (
                <div className="no-fields">
                  <FileText size={48} />
                  <h3>No fields configured</h3>
                  <p>This form doesn't have any fields yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormViewModal
