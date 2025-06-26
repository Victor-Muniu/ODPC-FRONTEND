import { useState, useEffect } from "react"
import { RefreshCw, Eye, Filter, Download, Calendar, Building, FileText, ChevronDown, ChevronRight } from "lucide-react"

function FormRequest() {
  const [submissions, setSubmissions] = useState([])
  const [groupedSubmissions, setGroupedSubmissions] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    setUserRole(role)
    loadFormRequests()
  }, [])

  const fetchFormRequests = async () => {
    const endpoint = userRole === "admin" ? "http://localhost:5000/all" : "http://localhost:5000/mine"
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
    if (!response.ok) throw new Error("Failed to fetch")
    return await response.json()
  }

  const normalizeSubmissionData = (rawSubmissions, isAdminData = true) => {
    if (isAdminData) return rawSubmissions
    return rawSubmissions.map(submission => ({
      submissionId: submission.id,
      formCollection: submission.form,
      formName: submission.formSlug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      department: submission.submittedBy.department,
      status: submission.status.replace(/_/g, ' '),
      submittedBy: {
        email: submission.submittedBy.email || 'N/A',
        role: submission.submittedBy.role || 'N/A',
        department: submission.submittedBy.department,
        uid: submission.submittedBy.uid
      },
      submittedAt: {
        _seconds: Math.floor(submission.createdAt / 1000)
      },
      workflow: submission.workflow,
      ...Object.keys(submission).reduce((acc, key) => {
        if (!['id', 'form', 'formSlug', 'submittedBy', 'workflow', 'status', 'createdAt'].includes(key)) {
          acc[key] = submission[key]
        }
        return acc
      }, {})
    }))
  }

  const loadFormRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchFormRequests()
      const isAdminData = userRole === "admin"
      const normalizedSubmissions = normalizeSubmissionData(response.submissions, isAdminData)
      setSubmissions(normalizedSubmissions)
      groupSubmissionsByCollection(normalizedSubmissions)
    } catch (err) {
      setError("Failed to load form requests. Please try again.")
      console.error("Error loading form requests:", err)
    } finally {
      setLoading(false)
    }
  }

  const groupSubmissionsByCollection = (subs) => {
    const grouped = {}
    subs.forEach(submission => {
      const { formCollection, formName, department } = submission
      if (!grouped[formCollection]) {
        grouped[formCollection] = {
          formName,
          department,
          submissions: [],
        }
      }
      grouped[formCollection].submissions.push(submission)
    })
    setGroupedSubmissions(grouped)
    setExpandedGroups(new Set(Object.keys(grouped)))
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "#10b981"
      case "pending":
      case "pending recommendation": return "#f59e0b"
      case "rejected": return "#ef4444"
      case "under review": return "#3b82f6"
      default: return "#6b7280"
    }
  }

  const toggleGroup = (formCollection) => {
    const newExpanded = new Set(expandedGroups)
    newExpanded.has(formCollection) ? newExpanded.delete(formCollection) : newExpanded.add(formCollection)
    setExpandedGroups(newExpanded)
  }

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission)
    setViewModalOpen(true)
  }

  const getDynamicFields = (submission) => {
    const exclude = ["submissionId", "formCollection", "formName", "department", "status", "submittedBy", "submittedAt", "workflow"]
    return Object.entries(submission).filter(([key]) => !exclude.includes(key))
  }

  const getUniqueStatuses = () => Array.from(new Set(submissions.map(s => s.status)))

  const filteredSubmissions = (subs) => {
    if (statusFilter === "all") return subs
    return subs.filter(s => s.status.toLowerCase() === statusFilter.toLowerCase())
  }

  if (loading) {
    return (
      <div className="form-requests">
        <div className="loading-state">
          <div className="loading-spinner">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <p>Loading form requests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="form-requests">
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={loadFormRequests} className="btn-text">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="form-requests">
        <div className="requests-header">
          <div>
            <h2>{userRole === "admin" ? "All Form Requests" : "My Form Requests"}</h2>
            <p>{userRole === "admin"
              ? "View and manage all form submissions across departments"
              : "View your form submissions and their status"}</p>
          </div>
          <div className="header-actions">
            <div className="filter-group">
              <Filter size={16} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select">
                <option value="all">All Status</option>
                {getUniqueStatuses().map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <button className="btn-secondary" onClick={loadFormRequests}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button className="btn-primary">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="requests-content">
          {Object.entries(groupedSubmissions).map(([formCollection, group]) => {
            const isExpanded = expandedGroups.has(formCollection)
            const filteredSubs = filteredSubmissions(group.submissions)
            if (filteredSubs.length === 0 && statusFilter !== "all") return null

            return (
              <div key={formCollection} className="form-group-section">
                <div className="form-group-header" onClick={() => toggleGroup(formCollection)}>
                  <div className="group-info">
                    <div className="group-toggle">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div className="group-details">
                      <h3>{group.formName}</h3>
                      <div className="group-meta">
                        <span className="department-badge"><Building size={14} /> {group.department}</span>
                        <span className="submissions-count"><FileText size={14} /> {filteredSubs.length} submission{filteredSubs.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="group-status-summary">
                    {getUniqueStatuses().map(status => {
                      const count = filteredSubs.filter(s => s.status === status).length
                      if (count === 0) return null
                      return (
                        <span
                          key={status}
                          className="status-summary-badge"
                          style={{ backgroundColor: `${getStatusColor(status)}20`, color: getStatusColor(status) }}
                        >
                          {count} {status}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {isExpanded && (
                  <div className="form-group-content">
                    <div className="dynamic-table-container">
                      <table className="dynamic-table">
                        <thead>
                          <tr>
                            <th>Submission ID</th>
                            <th>Submitted By</th>
                            <th>Submitted At</th>
                            <th>Status</th>
                            {filteredSubs.length > 0 && getDynamicFields(filteredSubs[0]).map(([key]) => <th key={key}>{key}</th>)}
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSubs.map(submission => (
                            <tr key={submission.submissionId}>
                              <td>{submission.submissionId.substring(0, 8)}...</td>
                              <td>
                                <div className="submitter-info">
                                  <div>{submission.submittedBy.email}</div>
                                  <div>{submission.submittedBy.role} • {submission.submittedBy.department}</div>
                                </div>
                              </td>
                              <td><Calendar size={14} /> {formatDate(submission.submittedAt)}</td>
                              <td>
                                <span
                                  className="status-badge"
                                  style={{
                                    backgroundColor: `${getStatusColor(submission.status)}20`,
                                    color: getStatusColor(submission.status),
                                  }}
                                >
                                  {submission.status}
                                </span>
                              </td>
                              {getDynamicFields(submission).map(([key, value]) => (
                                <td key={key}>{String(value).length > 50 ? `${String(value).substring(0, 50)}...` : String(value)}</td>
                              ))}
                              <td>
                                <button className="btn-icon" onClick={() => handleViewSubmission(submission)}>
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {viewModalOpen && selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false)
            setSelectedSubmission(null)
          }}
        />
      )}
    </>
  )
}

const SubmissionDetailModal = ({ submission, isOpen, onClose }) => {
  if (!isOpen) return null

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "#10b981"
      case "pending":
      case "pending recommendation": return "#f59e0b"
      case "rejected": return "#ef4444"
      case "under review": return "#3b82f6"
      default: return "#6b7280"
    }
  }

  const getDynamicFields = (submission) => {
    const exclude = ["submissionId", "formCollection", "formName", "department", "status", "submittedBy", "submittedAt", "workflow"]
    return Object.entries(submission).filter(([key]) => !exclude.includes(key))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container submission-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Submission Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <h3>{submission.formName}</h3>
          <div>
            <strong>Email:</strong> {submission.submittedBy.email}<br />
            <strong>Role:</strong> {submission.submittedBy.role}<br />
            <strong>Department:</strong> {submission.submittedBy.department}<br />
            <strong>Submitted:</strong> {formatDate(submission.submittedAt)}<br />
            <strong>Status:</strong> <span style={{ color: getStatusColor(submission.status) }}>{submission.status}</span>
          </div>

          {submission.workflow && (
            <div>
              <h4>Workflow Status</h4>
              {Object.entries(submission.workflow).map(([key, value]) => (
                <div key={key}>
                  <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong><br />
                  Name: {value.name || 'N/A'} | Role: {value.role || 'N/A'} | Status: {value.status || 'N/A'}
                </div>
              ))}
            </div>
          )}

          <h4>Form Data</h4>
          {getDynamicFields(submission).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {String(value)}</p>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormRequest
