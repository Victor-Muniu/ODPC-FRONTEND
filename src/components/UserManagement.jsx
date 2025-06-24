"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  Calendar,
  Mail,
  Building,
  X,
  AlertTriangle,
  RefreshCw,
  Plus,
  Settings,
} from "lucide-react"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [showRoleManager, setShowRoleManager] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [newRole, setNewRole] = useState({ name: "", color: "#3b82f6", description: "" })

  const departments = [
    "Legal Affairs",
    "Complaints Investigation & Enforcement",
    "Policy & Research",
    "Drivers",
    "Finance & Procurement",
    "Human Resources",
    "Information Technology",
  ]

  const defaultColors = [
    "#3b82f6",
    "#059669",
    "#dc2626",
    "#7c3aed",
    "#f59e0b",
    "#64748b",
    "#0891b2",
    "#e11d48",
    "#7c2d12",
    "#166534",
  ]

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, departmentFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:5000/users", {
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
      setUsers(data.users || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/roles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles || [])
      } else {
        // If roles endpoint doesn't exist or returns error, use default roles
        console.log("Roles endpoint not available, using default roles")
        setRoles([
          { id: "user", name: "User", color: "#64748b", description: "Standard user access" },
          { id: "admin", name: "Administrator", color: "#3b82f6", description: "Administrative access" },
        ])
      }
    } catch (err) {
      console.log("Error fetching roles, using default roles:", err)
      // Fallback to default roles if API is not available
      setRoles([
        { id: "user", name: "User", color: "#64748b", description: "Standard user access" },
        { id: "admin", name: "Administrator", color: "#3b82f6", description: "Administrative access" },
      ])
    }
  }

  const createRole = async (roleData) => {
    try {
      setUpdating(true)

      const response = await fetch("http://localhost:5000/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(roleData),
      })

      if (response.ok) {
        const result = await response.json()
        setRoles((prev) => [...prev, result.role])
        setNewRole({ name: "", color: "#3b82f6", description: "" })
      } else {
        // Fallback: add to local state if API not available
        const newRoleObj = {
          id: roleData.name.toLowerCase().replace(/\s+/g, "_"),
          ...roleData,
        }
        setRoles((prev) => [...prev, newRoleObj])
        setNewRole({ name: "", color: "#3b82f6", description: "" })
      }
    } catch (err) {
      console.error("Error creating role:", err)
      // Fallback: add to local state
      const newRoleObj = {
        id: roleData.name.toLowerCase().replace(/\s+/g, "_"),
        ...roleData,
      }
      setRoles((prev) => [...prev, newRoleObj])
      setNewRole({ name: "", color: "#3b82f6", description: "" })
    } finally {
      setUpdating(false)
    }
  }

  const updateRole = async (roleId, roleData) => {
    try {
      setUpdating(true)

      const response = await fetch(`http://localhost:5000/roles/${roleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(roleData),
      })

      if (response.ok) {
        setRoles((prev) => prev.map((role) => (role.id === roleId ? { ...role, ...roleData } : role)))
      } else {
        // Fallback: update local state
        setRoles((prev) => prev.map((role) => (role.id === roleId ? { ...role, ...roleData } : role)))
      }
      setEditingRole(null)
    } catch (err) {
      console.error("Error updating role:", err)
      // Fallback: update local state
      setRoles((prev) => prev.map((role) => (role.id === roleId ? { ...role, ...roleData } : role)))
      setEditingRole(null)
    } finally {
      setUpdating(false)
    }
  }

  const deleteRole = async (roleId) => {
    try {
      setUpdating(true)

      const response = await fetch(`http://localhost:5000/roles/${roleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.ok || response.status === 404) {
        setRoles((prev) => prev.filter((role) => role.id !== roleId))
      } else {
        // Fallback: remove from local state
        setRoles((prev) => prev.filter((role) => role.id !== roleId))
      }
    } catch (err) {
      console.error("Error deleting role:", err)
      // Fallback: remove from local state
      setRoles((prev) => prev.filter((role) => role.id !== roleId))
    } finally {
      setUpdating(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.designation?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((user) => user.department === departmentFilter)
    }

    setFilteredUsers(filtered)
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdating(true)

      const response = await fetch(`http://localhost:5000/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update local state
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      setEditingUser(null)
    } catch (err) {
      console.error("Error updating user role:", err)
      setError("Failed to update user role. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const deleteUser = async (userId) => {
    try {
      setUpdating(true)

      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Remove from local state
      setUsers((prev) => prev.filter((user) => user.id !== userId))
      setDeletingUser(null)
    } catch (err) {
      console.error("Error deleting user:", err)
      setError("Failed to delete user. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown"
    const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRoleInfo = (roleId) => {
    const role = roles.find((r) => r.id === roleId || r.name === roleId)
    return role || { id: roleId, name: roleId, color: "#64748b", description: "Unknown role" }
  }

  const getStats = () => {
    const totalUsers = users.length
    const roleStats = roles.reduce((acc, role) => {
      acc[role.id] = users.filter((user) => user.role === role.id || user.role === role.name).length
      return acc
    }, {})

    return { totalUsers, roleStats }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="form-requests">
        <div className="loading-state">
          <div className="loading-spinner">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form-requests">
      <div className="requests-header">
        <div>
          <h2>User Management</h2>
          <p>Manage user accounts, roles, and permissions</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowRoleManager(true)}>
            <Settings size={16} />
            Manage Roles
          </button>
          <button className="btn-secondary" onClick={fetchUsers} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="btn-text">
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ backgroundColor: "#3b82f620", color: "#3b82f6" }}>
              <Users size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        {roles.slice(0, 4).map((role) => (
          <div key={role.id} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: `${role.color}20`, color: role.color }}>
                <Shield size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3>{stats.roleStats[role.id] || 0}</h3>
              <p>{role.name}s</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="content-section" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div className="filter-group">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", minWidth: "250px" }}
            />
          </div>

          <div className="filter-group">
            <Filter size={16} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-select"
              style={{ minWidth: "150px" }}
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Building size={16} />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="form-select"
              style={{ minWidth: "200px" }}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="content-section">
        <div className="dynamic-table-container">
          <table className="dynamic-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role)
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="submitter-info">
                        <div>
                          {user.firstname} {user.lastname}
                        </div>
                        <div>@{user.username}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                          <Mail size={12} />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ fontWeight: "500" }}>{user.department}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>{user.designation}</div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: `${roleInfo.color}20`,
                          color: roleInfo.color,
                          border: `1px solid ${roleInfo.color}40`,
                        }}
                      >
                        {roleInfo.name}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                        <Calendar size={12} />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn-icon" onClick={() => setEditingUser(user)} title="Edit Role">
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => setDeletingUser(user)}
                          title="Delete User"
                          style={{ color: "#dc2626" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && !loading && (
            <div className="empty-forms-state">
              <Users size={48} />
              <h3>No users found</h3>
              <p>No users match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Role Manager Modal */}
      {showRoleManager && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: "800px" }}>
            <div className="modal-header">
              <div className="modal-title">
                <h2>Role Management</h2>
                <p>Create, edit, and manage user roles</p>
              </div>
              <button className="modal-close" onClick={() => setShowRoleManager(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {/* Create New Role */}
              <div className="form-group">
                <h3 style={{ marginBottom: "16px" }}>Create New Role</h3>
                <div
                  style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr auto", gap: "12px", alignItems: "end" }}
                >
                  <div>
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newRole.name}
                      onChange={(e) => setNewRole((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div>
                    <label className="form-label">Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="color"
                        value={newRole.color}
                        onChange={(e) => setNewRole((prev) => ({ ...prev, color: e.target.value }))}
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newRole.description}
                      onChange={(e) => setNewRole((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Role description"
                    />
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => createRole(newRole)}
                    disabled={!newRole.name.trim() || updating}
                    style={{ height: "44px" }}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>

              {/* Existing Roles */}
              <div className="form-group">
                <h3 style={{ marginBottom: "16px" }}>Existing Roles ({roles.length})</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        background: "white",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: role.color,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600", marginBottom: "4px" }}>{role.name}</div>
                        <div style={{ fontSize: "14px", color: "#6b7280" }}>{role.description}</div>
                      </div>
                      <div style={{ fontSize: "14px", color: "#6b7280", minWidth: "60px" }}>
                        {stats.roleStats[role.id] || 0} users
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn-icon" onClick={() => setEditingRole(role)} title="Edit Role">
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => deleteRole(role.id)}
                          title="Delete Role"
                          style={{ color: "#dc2626" }}
                          disabled={stats.roleStats[role.id] > 0}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowRoleManager(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="modal-overlay">
          <div className="modal-container submission-modal">
            <div className="modal-header">
              <div className="modal-title">
                <h2>Edit Role</h2>
                <p>Modify role details</p>
              </div>
              <button className="modal-close" onClick={() => setEditingRole(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Role Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={editingRole.color}
                    onChange={(e) => setEditingRole((prev) => ({ ...prev, color: e.target.value }))}
                    style={{ width: "50px", height: "40px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {defaultColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditingRole((prev) => ({ ...prev, color }))}
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: color,
                          border: editingRole.color === color ? "3px solid #000" : "1px solid #e2e8f0",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditingRole(null)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => updateRole(editingRole.id, editingRole)}
                disabled={!editingRole.name.trim() || updating}
              >
                {updating ? "Updating..." : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Role Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-container submission-modal">
            <div className="modal-header">
              <div className="modal-title">
                <h2>Edit User Role</h2>
                <p>
                  Change role for {editingUser.firstname} {editingUser.lastname}
                </p>
              </div>
              <button className="modal-close" onClick={() => setEditingUser(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Current Role</label>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", marginBottom: "16px" }}>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: `${getRoleInfo(editingUser.role).color}20`,
                      color: getRoleInfo(editingUser.role).color,
                    }}
                  >
                    {getRoleInfo(editingUser.role).name}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Role</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      className={`role-option ${editingUser.role === role.id ? "current" : ""}`}
                      onClick={() => updateUserRole(editingUser.id, role.id)}
                      disabled={updating || editingUser.role === role.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        border: `2px solid ${editingUser.role === role.id ? role.color : "#e2e8f0"}`,
                        borderRadius: "8px",
                        background: editingUser.role === role.id ? `${role.color}10` : "white",
                        cursor: editingUser.role === role.id ? "default" : "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <Shield size={16} style={{ color: role.color }} />
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={{ fontWeight: "500", color: "#1e293b" }}>{role.name}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>{role.description}</div>
                      </div>
                      {editingUser.role === role.id && <UserCheck size={16} style={{ color: role.color }} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditingUser(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="modal-overlay">
          <div className="modal-container submission-modal">
            <div className="modal-header">
              <div className="modal-title">
                <h2>Delete User Account</h2>
                <p>This action cannot be undone</p>
              </div>
              <button className="modal-close" onClick={() => setDeletingUser(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <AlertTriangle size={24} style={{ color: "#dc2626" }} />
                <div>
                  <h4 style={{ color: "#dc2626", marginBottom: "4px" }}>Warning</h4>
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>
                    You are about to permanently delete the account for:
                  </p>
                </div>
              </div>

              <div style={{ padding: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px" }}>
                <div style={{ fontWeight: "600", marginBottom: "8px" }}>
                  {deletingUser.firstname} {deletingUser.lastname}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
                  Email: {deletingUser.email}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
                  Username: @{deletingUser.username}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Role: {getRoleInfo(deletingUser.role).name}</div>
              </div>

              <p style={{ marginTop: "16px", fontSize: "14px", color: "#6b7280" }}>
                This will permanently delete their account, remove all associated data, and revoke all access
                permissions.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeletingUser(null)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => deleteUser(deletingUser.id)}
                disabled={updating}
                style={{ background: "#dc2626" }}
              >
                {updating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
