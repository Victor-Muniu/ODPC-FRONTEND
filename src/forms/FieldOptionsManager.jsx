import React, { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

const FieldOptionsManager = ({ options, onChange, fieldType }) => {
  const [newOption, setNewOption] = useState("")

  const addOption = () => {
    if (!newOption.trim()) return
    onChange([...options, newOption.trim()])
    setNewOption("")
  }

  const removeOption = (index) => {
    const updatedOptions = [...options]
    updatedOptions.splice(index, 1)
    onChange(updatedOptions)
  }

  return (
    <div className="field-options-manager">
      <label>
        {fieldType === "select"
          ? "Dropdown Options"
          : `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Options`}
      </label>

      <div className="options-list">
        {options.map((option, index) => (
          <div key={index} className="option-item">
            <span>{option}</span>
            <button
              type="button"
              className="btn-icon"
              onClick={() => removeOption(index)}
              aria-label={`Remove option ${option}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {options.length === 0 && <p className="no-options">No options added yet</p>}
      </div>

      <div className="option-input-group">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          className="form-input"
          placeholder="Enter option text"
        />
        <button
          type="button"
          className="btn-primary"
          onClick={addOption}
          disabled={!newOption.trim()}
        >
          <Plus size={16} />
          Add Option
        </button>
      </div>
    </div>
  )
}

export default FieldOptionsManager
