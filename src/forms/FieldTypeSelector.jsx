import {
  Type,
  Mail,
  Hash,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Calendar,
  Upload,
  Circle,
  PenTool,
  Info,
  FileText,
  Shield,
} from "lucide-react"

const FieldTypeSelector = ({ value, onChange }) => {
  const fieldTypes = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "email", label: "Email", icon: Mail },
    { value: "number", label: "Number", icon: Hash },
    { value: "textarea", label: "Text Area", icon: AlignLeft },
    { value: "select", label: "Dropdown", icon: ChevronDown },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "radio", label: "Radio Button", icon: Circle },
    { value: "date", label: "Date", icon: Calendar },
    { value: "file", label: "File Upload", icon: Upload },
    { value: "signature", label: "Signature", icon: PenTool },
    { value: "info", label: "Info/Instructions", icon: Info },
    { value: "static", label: "Static Text", icon: FileText },
    { value: "declaration", label: "Declaration/Agreement", icon: Shield },
  ]

  return (
    <div className="form-group">
      <label>Field Type</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-input">
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
