import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  Eye,
  FileText,
  RefreshCw,
} from "lucide-react";
import FormViewModal from "../modals/FormViewModal";
import FieldTypeSelector from "../forms/FieldTypeSelector";
import FieldOptionsManager from "../forms/FieldOptionsManager";
import FieldPreview from "../forms/FieldPreview";

const FormBuilder = () =>{
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedForm, setSelectedForm] = useState(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const [newField, setNewField] = useState({
    type: "text",
    label: "",
    name: "",
    options: [],
    required: false,
    text: [],
    content: "",
  })
  const [newApprover, setNewApprover] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewingForm, setViewingForm] = useState(null)

  useEffect(() => {
    loadForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:5000/forms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch forms")
      return await response.json()
    } catch (error) {
      console.error("Error fetching forms:", error)
      throw error
    }
  }

  const loadForms = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchForms()
      setForms(response.forms || [])
    } catch (err) {
      setError("Failed to load forms. Please try again.")
      console.error("Error loading forms:", err)
    } finally {
      setLoading(false)
    }
  }

  const publishFormToAPI = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/create-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to publish form")
      return await response.json()
    } catch (error) {
      console.error("Error publishing form:", error)
      throw error
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown"
    const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp)
    return date.toLocaleDateString()
  }

  const handleViewForm = (form) => {
    setViewingForm(form)
    setViewModalOpen(true)
  }

  const createNewForm = () => {
    const newForm = {
      id: `form_${Date.now()}`,
      formName: "New Form",
      slug: `new_form_${Date.now()}`,
      fields: [],
      approvers: [],
      department: "",
      status: "draft",
      createdAt: new Date(),
    }
    setSelectedForm(newForm)
    setIsBuilding(true)
  }

  const generateFieldName = (label) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
  }

  const addField = () => {
    if (!selectedForm || !newField.label) return

    if (
      (newField.type === "checkbox" || newField.type === "radio" || newField.type === "select") &&
      (!newField.options || newField.options.length === 0)
    ) {
      return
    }

    const fieldName = newField.name || generateFieldName(newField.label)

    const field = {
      label: newField.label,
      name: fieldName,
      type: newField.type,
      required: newField.required,
      ...(newField.options && newField.options.length > 0 ? { options: newField.options } : {}),
      ...(newField.type === "info" && newField.text && newField.text.length > 0 ? { text: newField.text } : {}),
      ...(newField.type === "static" && newField.content ? { content: newField.content } : {}),
    }

    setSelectedForm({
      ...selectedForm,
      fields: [...selectedForm.fields, field],
    })

    setNewField({
      type: "text",
      label: "",
      name: "",
      options: [],
      required: false,
      text: [],
      content: "",
    })
  }

  const removeField = (fieldIndex) => {
    if (!selectedForm) return
    setSelectedForm({
      ...selectedForm,
      fields: selectedForm.fields.filter((_, index) => index !== fieldIndex),
    })
  }

  const addApprover = () => {
    if (!selectedForm || !newApprover.trim()) return

    const approver = { role: newApprover.trim() }

    setSelectedForm({
      ...selectedForm,
      approvers: [...selectedForm.approvers, approver],
    })

    setNewApprover("")
  }

  const removeApprover = (index) => {
    if (!selectedForm) return
    setSelectedForm({
      ...selectedForm,
      approvers: selectedForm.approvers.filter((_, i) => i !== index),
    })
  }

  const publishForm = async () => {
    if (!selectedForm || !selectedForm.formName || !selectedForm.department) {
      alert("Please fill in form name and department")
      return
    }

    setIsPublishing(true)

    try {
      const formData = {
        formName: selectedForm.formName,
        slug: selectedForm.slug || generateFieldName(selectedForm.formName),
        fields: selectedForm.fields,
        approvers: selectedForm.approvers,
        department: selectedForm.department,
        status: "published",
      }

      await publishFormToAPI(formData)
      alert("Form published successfully!")

      await loadForms()

      setIsBuilding(false)
      setSelectedForm(null)
    } catch (error) {
      alert("Failed to publish form. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  const saveDraft = () => {
    if (!selectedForm) return
    setIsBuilding(false)
    setSelectedForm(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "#10b981"
      case "draft":
        return "#f59e0b"
      case "archived":
        return "#6b7280"
      default:
        return "#10b981"
    }
  }

  const getStatusText = (form) => {
    return form.status || "published"
  }
  if (isBuilding && selectedForm) {
    return (
      <div className="form-builder">
        <div className="builder-header">
          <div>
            <h2>Form Builder</h2>
            <p>Create and configure forms for data protection processes</p>
          </div>
          <div className="builder-actions">
            <button className="btn-secondary" onClick={() => setIsBuilding(false)}>
              Cancel
            </button>
            <button className="btn-secondary" onClick={saveDraft}>
              Save Draft
            </button>
            <button className="btn-primary" onClick={publishForm} disabled={isPublishing}>
              <Save size={16} />
              {isPublishing ? "Publishing..." : "Publish Form"}
            </button>
          </div>
        </div>

        <div className="builder-content">
          <div className="form-settings">
            <div className="settings-section">
              <h3>Form Settings</h3>
              <div className="form-group">
                <label>Form Name</label>
                <input
                  type="text"
                  value={selectedForm.formName}
                  onChange={(e) =>
                    setSelectedForm({
                      ...selectedForm,
                      formName: e.target.value,
                      slug: generateFieldName(e.target.value),
                    })
                  }
                  className="form-input"
                  placeholder="Enter form name"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  value={selectedForm.department}
                  onChange={(e) =>
                    setSelectedForm({
                      ...selectedForm,
                      department: e.target.value,
                    })
                  }
                  className="form-input"
                >
                  <option value="">Select Department</option>
                  <option value="Legal Affairs">Legal Affairs</option>
                  <option value="Compliance & Enforcement">Compliance & Enforcement</option>
                  <option value="Policy & Research">Policy & Research</option>
                  <option value="Investigations">Investigations</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Administration">Administration</option>
                  <option value="Finance & Procurement">Finance & Procurement</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="settings-section">
              <h3>Add Field</h3>
              <div className="field-builder">
                <FieldTypeSelector
                  value={newField.type || "text"}
                  onChange={(type) => setNewField({ ...newField, type })}
                />
                <div className="form-group">
                  <label>Field Label</label>
                  <input
                    type="text"
                    value={newField.label || ""}
                    onChange={(e) =>
                      setNewField({
                        ...newField,
                        label: e.target.value,
                        name: generateFieldName(e.target.value),
                      })
                    }
                    className="form-input"
                    placeholder="Enter field label"
                  />
                </div>

                <div className="form-group">
                  <label>Field Name (auto-generated)</label>
                  <input
                    type="text"
                    value={newField.name || ""}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    className="form-input"
                    placeholder="field_name"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newField.required || false}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    />
                    Required Field
                  </label>
                </div>

                {(newField.type === "checkbox" || newField.type === "radio" || newField.type === "select") && (
                  <FieldOptionsManager
                    options={newField.options || []}
                    onChange={(options) => setNewField({ ...newField, options })}
                    fieldType={newField.type}
                  />
                )}

                {newField.type === "info" && (
                  <div className="form-group">
                    <label>Info Text (one per line)</label>
                    <textarea
                      value={newField.text ? newField.text.join("\n") : ""}
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          text: e.target.value.split("\n").filter((line) => line.trim()),
                        })
                      }
                      className="form-textarea"
                      placeholder="Enter info text, one line per item"
                      rows={4}
                    />
                  </div>
                )}

                {newField.type === "static" && (
                  <div className="form-group">
                    <label>Static Content</label>
                    <textarea
                      value={newField.content || ""}
                      onChange={(e) => setNewField({ ...newField, content: e.target.value })}
                      className="form-textarea"
                      placeholder="Enter static content"
                      rows={3}
                    />
                  </div>
                )}

                <button
                  className="btn-primary"
                  onClick={addField}
                  disabled={
                    !newField.label ||
                    ((newField.type === "checkbox" || newField.type === "radio" || newField.type === "select") &&
                      (!newField.options || newField.options.length === 0)) ||
                    (newField.type === "info" && (!newField.text || newField.text.length === 0)) ||
                    (newField.type === "static" && !newField.content)
                  }
                  type="button"
                >
                  <Plus size={16} />
                  Add Field
                </button>
              </div>
            </div>

            <div className="settings-section">
              <h3>Approvers</h3>
              <div className="approvers-list">
                {selectedForm.approvers.map((approver, index) => (
                  <div key={index} className="approver-item">
                    <span>{approver.role}</span>
                    <button className="btn-icon" onClick={() => removeApprover(index)} type="button">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="approver-builder">
                <div className="form-group">
                  <label>Add Approver Role</label>
                  <input
                    type="text"
                    value={newApprover}
                    onChange={(e) => setNewApprover(e.target.value)}
                    className="form-input"
                    placeholder="Enter approver role"
                  />
                </div>
                <button className="btn-primary" onClick={addApprover} disabled={!newApprover.trim()} type="button">
                  <Plus size={16} />
                  Add Approver
                </button>
              </div>
            </div>
          </div>

          <div className="form-preview">
            <h3>Form Preview</h3>
            <div className="preview-container">
              <div className="preview-header">
                <h4>{selectedForm.formName}</h4>
                <p>Department: {selectedForm.department}</p>
              </div>
              <div className="preview-fields">
                {selectedForm.fields.map((field, index) => (
                  <FieldPreview key={index} field={field} onRemove={() => removeField(index)} />
                ))}
                {selectedForm.fields.length === 0 && (
                  <div className="empty-state">
                    <p>No fields added yet. Add fields using the form builder on the left.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="configurations">
        <div className="config-header">
          <div>
            <h2>Form Configurations</h2>
            <p>Manage and create forms for data protection processes</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={loadForms} disabled={loading}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button className="btn-primary" onClick={createNewForm}>
              <Plus size={16} />
              Create New Form
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={loadForms} className="btn-text">
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">
              <RefreshCw size={24} className="animate-spin" />
            </div>
            <p>Loading forms...</p>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map((form) => (
              <div key={form.id} className="form-card">
                <div className="form-card-header">
                  <div className="form-status">
                    <div
                      className="status-dot"
                      style={{
                        backgroundColor: getStatusColor(getStatusText(form)),
                      }}
                    />
                    <span className="status-text">{getStatusText(form)}</span>
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setSelectedForm(form)
                        setIsBuilding(true)
                      }}
                      title="Edit Form"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => handleViewForm(form)} title="View Form">
                      <Eye size={16} />
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
                    <p className="form-approvers">
                      Approvers: {form.approvers?.map((a) => a.role).join(", ") || "None"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {forms.length === 0 && !loading && (
              <div className="empty-forms-state">
                <FileText size={48} />
                <h3>No forms found</h3>
                <p>Create your first form to get started</p>
                <button className="btn-primary" onClick={createNewForm}>
                  <Plus size={16} />
                  Create New Form
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <FormViewModal
        form={viewingForm}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setViewingForm(null)
        }}
      />
    </>
  )
}
export default FormBuilder;
