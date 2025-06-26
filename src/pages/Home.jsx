import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../modules/Dashboard";
import FormBuilder from "../modules/FormBuilder";
import FormRequest from "../components/FormRequest";
import PublicFormPage from "../components/PublicFormPage";
import { Bell, Search, User } from "lucide-react";
import { getUserRole, getUserInfo } from "../utils/Auth";
import "./Home.css";
import UserManagement from "../components/UserManagement";
import Approvers from "../components/Approvers";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const role = getUserRole();
    const info = getUserInfo();
    setUserRole(role);
    setUserInfo(info);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeView) {
      case "configurations":
        return <FormBuilder />;
      case "requests":
        return <FormRequest />;
      case "form-renderer":
        return <PublicFormPage />;
      case "user-management":
        return <UserManagement />;
      case "approvals":
        return <Approvers />;
      case "submissions":
        return (
          <div className="coming-soon">
            <h2>Form Submissions</h2>
            <p>
              View all form submissions
              {userRole === "user" ? " you've made" : " across the system"}
            </p>
            <small>Coming Soon</small>
          </div>
        );
      case "analytics":
        return (
          <div className="coming-soon">
            <h2>Analytics Dashboard</h2>
            <p>
              View system metrics and insights
              {userRole === "HOD" || userRole === "Assistant HOD"
                ? " for your department"
                : ""}
            </p>
            <small>Coming Soon</small>
          </div>
        );
      case "compliance":
        return (
          <div className="coming-soon">
            <h2>Compliance Monitor</h2>
            <p>
              Monitor data protection compliance and regulatory requirements
            </p>
            <small>Coming Soon</small>
          </div>
        );
      case "audit-logs":
        return (
          <div className="coming-soon">
            <h2>Audit Logs</h2>
            <p>View system activity and audit trails</p>
            <small>Coming Soon</small>
          </div>
        );
      case "notifications":
        return (
          <div className="coming-soon">
            <h2>Notifications Center</h2>
            <p>Manage your notifications and alerts</p>
            <small>Coming Soon</small>
          </div>
        );
      case "help":
        return (
          <div className="coming-soon">
            <h2>Help & Support</h2>
            <p>Access documentation and support resources</p>
            <small>Coming Soon</small>
          </div>
        );
      case "dashboard":
      default:
        return <Dashboard userRole={userRole} userInfo={userInfo} />;
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      super_admin: "Super Administrator",
      admin: "ODPC Administrator",
      HOD: "Head of Department",
      "Assistant HOD": "Assistant Head of Department",
      reviewer: "Reviewer",
      user: "Regular User",
      data_protection_officer: "Data Protection Officer",
    };
    return roleNames[role] || role || "Unknown Role";
  };

  const getSearchPlaceholder = (role) => {
    switch (role) {
      case "admin":
      case "super_admin":
        return "Search forms, requests, users...";
      case "HOD":
        return "Search department forms, approvals...";
      case "Assistant HOD":
        return "Search forms, pending approvals...";
      case "reviewer":
        return "Search pending reviews, forms...";
      case "data_protection_officer":
        return "Search compliance reports, audits...";
      case "user":
      default:
        return "Search my forms, requests...";
    }
  };

  return (
    <div className="app">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        activeItem={activeView}
        onItemClick={setActiveView}
      />

      <div
        className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <header className="top-header">
          <div className="header-left">
            <div className="search-container">
              <Search size={20} />
              <input
                type="text"
                placeholder={getSearchPlaceholder(userRole)}
                className="search-input"
              />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn" title="Notifications">
              <Bell size={20} />
              <span className="notification-badge">5</span>
            </button>
            <div className="user-profile">
              <div
                className="user-avatar"
                title={userInfo?.department || "ODPC"}
              >
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">
                  {userInfo?.fullName || "User"}
                </span>
                <span className="user-role">
                  {getRoleDisplayName(userRole)}
                </span>
                {userInfo?.department && (
                  <span className="user-department">{userInfo.department}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="main-dashboard">{renderContent()}</main>
      </div>
    </div>
  );
}
