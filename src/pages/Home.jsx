import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../modules/Dashboard";
import FormBuilder from "../modules/FormBuilder";
import FormRequest from "../components/FormRequest";
import PublicFormPage from "../components/PublicFormPage";
import { Bell, Search, User } from "lucide-react";
import { getUserRole, getUserInfo } from "../utils/Auth";
import './Home.css'
import UserManagement from "../components/UserManagement";

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
        return <PublicFormPage />
      case "user-management":
        return <UserManagement />;
      case "submissions":
        return <div className="coming-soon">Form Submissions - Coming Soon</div>;
      case "analytics":
        return <div className="coming-soon">Analytics - Coming Soon</div>;
      case "help":
        return <div className="coming-soon">Help & Support - Coming Soon</div>;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "ODPC Administrator";
      case "user":
        return "Regular User";
      default:
        return "Unknown Role";
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

      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <header className="top-header">
          <div className="header-left">
            <div className="search-container">
              <Search size={20} />
              <input type="text" placeholder="Search forms, requests..." className="search-input" />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn">
              <Bell size={20} />
              <span className="notification-badge">5</span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">{userInfo?.fullName || "Admin User"}</span>
                <span className="user-role">{getRoleDisplayName(userRole || "admin")}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="main-dashboard">{renderContent()}</main>
      </div>
    </div>
  );
}
