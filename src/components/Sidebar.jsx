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
  Database,
  Bell,
  Lock,
  FileCheck,
  UserCog,
  FormInput,

} from "lucide-react";
import { getUserRole, getUserInfo } from "../utils/Auth";
import Logo from './download.png'

const Sidebar = ({ isCollapsed, onToggle, activeItem = "dashboard", onItemClick }) => {
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const role = getUserRole();
    const info = getUserInfo();
    setUserRole(role);
    setUserInfo(info);
  }, []);

  const getMenuItems = () => {
    const baseItems = [{ id: "dashboard", label: "Dashboard", icon: Home }];

    const roleBasedItems = {
      
      admin: [
        { id: "configurations", label: "Form Configurations", icon: Settings },
        { id: "form-renderer", label: "Form Renderer", icon: FormInput },
        
        { id: "requests", label: "Form Requests", icon: FileText },
        { id: "approvals", label: "Approvals", icon: Shield },
        { id: "submissions", label: "Form Submissions", icon: Users },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "help", label: "Help & Support", icon: HelpCircle },
      ],
      reviewer: [
        { id: "requests", label: "Form Requests", icon: FileText },
        { id: "approvals", label: "My Approvals", icon: Shield },
        { id: "submissions", label: "Form Submissions", icon: Users },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "help", label: "Help & Support", icon: HelpCircle },
      ],
      user: [
        { id: "requests", label: "My Requests", icon: FileText },
        { id: "submissions", label: "My Submissions", icon: Users },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "help", label: "Help & Support", icon: HelpCircle },
      ],
      data_protection_officer: [
        { id: "configurations", label: "Form Configurations", icon: Settings },
        { id: "requests", label: "Form Requests", icon: FileText },
        { id: "approvals", label: "Approvals", icon: Shield },
        { id: "submissions", label: "Form Submissions", icon: Users },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "compliance", label: "Compliance Monitor", icon: Lock },
        { id: "audit-logs", label: "Audit Logs", icon: FileCheck },
        { id: "help", label: "Help & Support", icon: HelpCircle },
      ],
    };

    const userMenuItems = roleBasedItems[userRole || "user"] || roleBasedItems["user"];
    return [...baseItems, ...userMenuItems];
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      super_admin: "Super Administrator",
      admin: "Administrator",
      reviewer: "Reviewer",
      user: "User",
      data_protection_officer: "Data Protection Officer",
    };
    return roleNames[role] || "User";
  };

  const menuItems = getMenuItems();

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo">
            <img src={Logo} alt="ODPC Logo" className="logo-image" />
          </div>
          {!isCollapsed && (
            <div className="logo-text">
              <h2>ODPC</h2>
              <p>Office of the Data Protection Commissioner</p>
            </div>
          )}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {!isCollapsed && userInfo && (
        <div className="user-info-section">
          <div className="user-avatar-large">
            <UserCheck size={24} />
          </div>
          <div className="user-details">
            <h4>{userInfo.fullName}</h4>
            <p className="user-role-badge">{getRoleDisplayName(userRole || "user")}</p>
            {userInfo.department && <p className="user-department">{userInfo.department}</p>}
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

      {isCollapsed && userRole && (
        <div className="role-indicator">
          <div className="role-dot" title={getRoleDisplayName(userRole)}>
            {userRole.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
