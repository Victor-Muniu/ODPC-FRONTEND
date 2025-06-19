import React from "react"
import { Type, Mail, Hash, FileText, CheckSquare, Calendar, Radio } from "lucide-react"

const FieldTypeSelector = ({ value, onChange }) => {
  const fieldTypes = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "email", label: "Email", icon: Mail },
    { value: "number", label: "Number", icon: Hash },
    { value: "textarea", label: "Text Area", icon: FileText },
    { value: "select", label: "Dropdown", icon: CheckSquare },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "radio", label: "Radio Button", icon: Radio },
    { value: "date", label: "Date", icon: Calendar },
    { value: "file", label: "File Upload", icon: FileText },
  ]

  return (
    <div className="form-group">
      <label>Field Type</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-select">
        {fieldTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FieldTypeSelector
