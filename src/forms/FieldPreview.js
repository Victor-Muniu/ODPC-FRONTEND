import React from "react"
import { Trash2 } from "lucide-react"

const FieldPreview = ({ field, onRemove }) => {
  const renderField = () => {
    switch (field.type) {
      case "textarea":
        return <textarea className="preview-input" disabled rows={3} />

      case "select":
        return (
          <select className="preview-input" disabled>
            <option value="">Select an option</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "checkbox":
        return (
          <div className="checkbox-options-preview">
            {field.options?.map((option, i) => (
              <div key={i} className="checkbox-option">
                <input type="checkbox" id={`preview-checkbox-${i}`} disabled />
                <label htmlFor={`preview-checkbox-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        )

      case "radio":
        return (
          <div className="radio-options-preview">
            {field.options?.map((option, i) => (
              <div key={i} className="radio-option">
                <input
                  type="radio"
                  name={`preview-radio-${field.label}`}
                  id={`preview-radio-${i}`}
                  disabled
                />
                <label htmlFor={`preview-radio-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        )

      default:
        return <input type={field.type} className="preview-input" disabled />
    }
  }

  return (
    <div className="preview-field">
      <div className="field-header">
        <label>{field.label}</label>
        <button
          className="btn-icon"
          onClick={onRemove}
          aria-label={`Remove ${field.label} field`}
        >
          <Trash2 size={14} />
        </button>
      </div>
      {renderField()}
    </div>
  )
}

export default FieldPreview
