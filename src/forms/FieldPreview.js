import { Trash2, Shield } from "lucide-react"

const FieldPreview = ({ field, onRemove }) => {
  const renderFieldPreview = () => {
    switch (field.type) {
      case "declaration":
        return (
          <div className="declaration-field">
            <h4>
              <Shield size={18} />
              {field.label}
            </h4>
            <div className="declaration-content">
              <p>{field.content}</p>
            </div>
            <div className="declaration-checkbox">
              <input type="checkbox" disabled />
              <label>I agree to the above declaration</label>
            </div>
          </div>
        )

      case "checkbox":
        return (
          <div className="checkbox-options-preview">
            {field.options?.map((option, i) => (
              <div key={i} className="checkbox-preview">
                <input type="checkbox" disabled />
                <span>{option}</span>
              </div>
            ))}
          </div>
        )

      case "radio":
        return (
          <div className="radio-options-preview">
            {field.options?.map((option, i) => (
              <div key={i} className="checkbox-preview">
                <input type="radio" name={`preview-${field.name}`} disabled />
                <span>{option}</span>
              </div>
            ))}
          </div>
        )

      case "select":
        return (
          <select className="preview-input" disabled>
            <option>Select an option...</option>
            {field.options?.map((option, i) => (
              <option key={i}>{option}</option>
            ))}
          </select>
        )

      case "textarea":
        return <textarea className="preview-input" placeholder="Text area input..." disabled rows={3} />

      case "info":
        return (
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
        )

      case "static":
        return (
          <div className="info-field">
            <h4>{field.label}</h4>
            <p>{field.content}</p>
          </div>
        )

      default:
        return <input type={field.type} className="preview-input" placeholder={`${field.label} input...`} disabled />
    }
  }

  return (
    <div className="preview-field">
      <div className="field-header">
        <label>
          {field.label}
          {field.required && <span className="required-indicator">*</span>}
        </label>
        <button className="btn-icon" onClick={onRemove} title="Remove Field">
          <Trash2 size={14} />
        </button>
      </div>
      {renderFieldPreview()}
    </div>
  )
}

export default FieldPreview
