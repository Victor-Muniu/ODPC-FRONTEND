"use client";

import { useState, useEffect } from "react";
import {
  Home,
  FileText,
  Users,
  Shield,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Bell,
  Lock,
  FileCheck,
  FormInput,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { getUserRole, getUserInfo } from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import Logo from "./download.png";

const Sidebar = ({
  isCollapsed,
  onToggle,
  activeItem = "dashboard",
  onItemClick,
}) => {
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Add this loading state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRole();
    const info = getUserInfo();
    setUserRole(role);
    setUserInfo(info);
    setLoading(false); // Set loading to false after data is fetched
  }, []);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    // Optional: Clear any other user-related data
    // localStorage.clear(); // Use this if you want to clear everything

    // Redirect to login page
    navigate("/");
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getMenuItems = () => {
    const baseItems = [{ id: "dashboard", label: "Dashboard", icon: Home }];

    const roleBasedItems = {
      admin: [
        { id: "configurations", label: "Form Configurations", icon: Settings },
        { id: "form-renderer", label: "Form Renderer", icon: FormInput },

        { id: "requests", label: "Form Requests", icon: FileText },
        { id: "approvals", label: "Approvals", icon: Shield },
        { id: "submissions", label: "Form Submissions", icon: Users },
        { id: "user-management", label: "User Management", icon: Users },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "help", label: "Help & Support", icon: HelpCircle },
      ],
      HOD: [
        { id: "requests", label: "Form Requests", icon: FileText },
        { id: "form-renderer", label: "Form Renderer", icon: FormInput },
        { id: "approvals", label: "Approvals", icon: Shield },
        { id: "user-management", label: "User Management", icon: Users },
        { id: "notifications", label: "Notifications", icon: Bell },
      ],
      "Assistant HOD": [
        { id: "requests", label: "Form Requests", icon: FileText },
        { id: "form-renderer", label: "Form Renderer", icon: FormInput },
        { id: "approvals", label: "Approvals", icon: Shield },
        { id: "user-management", label: "User Management", icon: Users },
        { id: "notifications", label: "Notifications", icon: Bell },
      ],
      
      user: [
        { id: "requests", label: "My Requests", icon: FileText },
        { id: "form-renderer", label: "Form Renderer", icon: FormInput },
        { id: "notifications", label: "Notifications", icon: Bell },
        
      ]
    };

    // Debug logging to check role matching
    console.log("Current userRole:", userRole);
    console.log(
      "Available roles in roleBasedItems:",
      Object.keys(roleBasedItems),
    );

    const userMenuItems =
      roleBasedItems[userRole || "user"] || roleBasedItems["user"];
    console.log("Selected menu items for role:", userRole, userMenuItems);

    return [...baseItems, ...userMenuItems];
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      super_admin: "Super Administrator",
      admin: "Administrator",
      HOD: "Head of Department",
      "Assistant HOD": "Assistant Head of Department",
      reviewer: "Reviewer",
      user: "User",
      data_protection_officer: "Data Protection Officer",
    };
    return roleNames[role] || role || "User";
  };

  const menuItems = getMenuItems();

  // Add this right after the menuItems declaration and before the return statement
  if (loading) {
    return (
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <img
                src={Logo || "/placeholder.svg"}
                alt="ODPC Logo"
                className="logo-image"
              />
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <h2>ODPC</h2>
                <p>Office of the Data Protection Commissioner</p>
              </div>
            )}
          </div>
          <button className="toggle-btn" onClick={onToggle}>
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <div
          className="loading-state"
          style={{
            padding: "20px",
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div className="loading-spinner" style={{ marginBottom: "8px" }}>
            <UserCheck size={24} className="animate-spin" />
          </div>
          {!isCollapsed && (
            <p style={{ fontSize: "14px", margin: 0 }}>Loading...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <img
                src={Logo || "/placeholder.svg"}
                alt="ODPC Logo"
                className="logo-image"
              />
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <h2>ODPC</h2>
                <p>Office of the Data Protection Commissioner</p>
              </div>
            )}
          </div>
          <button className="toggle-btn" onClick={onToggle}>
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {!isCollapsed && userInfo && (
          <div className="user-info-section">
            <div className="user-avatar-large">
              <UserCheck size={24} />
            </div>
            <div className="user-details">
              <h4>{userInfo.fullName}</h4>
              <p className="user-role-badge">
                {getRoleDisplayName(userRole || "user")}
              </p>
              {userInfo.department && (
                <p className="user-department">{userInfo.department}</p>
              )}
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeItem === item.id ? "active" : ""}`}
                onClick={() => onItemClick && onItemClick(item.id)}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={confirmLogout}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

        {isCollapsed && userRole && (
          <div className="role-indicator">
            <div className="role-dot" title={getRoleDisplayName(userRole)}>
              {userRole.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="logout-modal-header">
              <div className="logout-icon">
                <AlertTriangle size={24} />
              </div>
              <h3>Confirm Logout</h3>
            </div>
            <div className="logout-modal-content">
              <p>
                Are you sure you want to logout? You will need to sign in again
                to access the system.
              </p>
            </div>
            <div className="logout-modal-actions">
              <button className="btn-secondary" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
