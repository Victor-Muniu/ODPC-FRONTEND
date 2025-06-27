import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../modules/Dashboard";
import FormBuilder from "../modules/FormBuilder";
import FormRequest from "../components/FormRequest";
import PublicFormPage from "../components/PublicFormPage";
import { Bell, Search, User, X } from "lucide-react";
import { getUserRole, getUserInfo } from "../utils/Auth";
import "./Home.css";
import "./search-styles.css";
import UserManagement from "../components/UserManagement";
import Approvers from "../components/Approvers";
import { SearchProvider, useSearch } from "../contexts/SearchContext";
import { useNotifications } from "../hooks/useNotifications";

// Search Results Component
const SearchResults = ({
  results,
  isSearching,
  searchTerm,
  onClose,
  onItemClick,
}) => {
  if (!searchTerm) return null;

  const formatFormName = (formSlug) => {
    return (
      formSlug?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "Unknown Form"
    );
  };

  const getResultIcon = (type) => {
    switch (type) {
      case "request":
        return "📝";
      case "approval":
        return "✅";
      default:
        return "📄";
    }
  };

  return (
    <div className="search-results-overlay">
      <div className="search-results-container">
        <div className="search-results-header">
          <h3>Search Results for "{searchTerm}"</h3>
          <button className="close-search-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {isSearching ? (
          <div className="search-loading">
            <div className="loading-spinner">🔍</div>
            <p>Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="no-search-results">
            <p>No results found for "{searchTerm}"</p>
            <small>Try searching with different keywords</small>
          </div>
        ) : (
          <div className="search-results-list">
            {results.map((result, index) => (
              <div
                key={result.id || index}
                className="search-result-item"
                onClick={() => onItemClick(result)}
              >
                <div className="result-icon">{getResultIcon(result.type)}</div>
                <div className="result-content">
                  <h4>{formatFormName(result.formSlug)}</h4>
                  <p>
                    {result.submittedBy?.department || "Unknown Department"}
                  </p>
                  <small>
                    {result.type === "approval"
                      ? "Pending Approval"
                      : "Form Request"}{" "}
                    • ID: {result.id?.substring(0, 8)}...
                  </small>
                </div>
                <div className="result-meta">
                  <span
                    className={`result-status ${result.status?.replace(/_/g, "-")}`}
                  >
                    {result.status?.replace(/_/g, " ") || "Unknown Status"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function HomeContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    setActiveView: setSearchActiveView,
    clearSearch,
  } = useSearch();
  const { approvalCount } = useNotifications();

  useEffect(() => {
    const role = getUserRole();
    const info = getUserInfo();
    setUserRole(role);
    setUserInfo(info);
  }, []);

  // Update search context when active view changes
  useEffect(() => {
    setSearchActiveView(activeView);
  }, [activeView, setSearchActiveView]);

  // Show search results when there's a search term
  useEffect(() => {
    setShowSearchResults(!!searchTerm);
  }, [searchTerm]);

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

  const getSearchPlaceholder = (role, view) => {
    switch (view) {
      case "requests":
        return "Search form requests...";
      case "approvals":
        return "Search pending approvals...";
      case "configurations":
        return "Search form configurations...";
      case "user-management":
        return "Search users...";
      case "dashboard":
      default:
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
    }
  };

  const handleSearchResultClick = (result) => {
    // Navigate to appropriate view based on result type
    if (result.type === "approval") {
      setActiveView("approvals");
    } else if (result.type === "request") {
      setActiveView("requests");
    }
    setShowSearchResults(false);
    clearSearch();
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
                placeholder={getSearchPlaceholder(userRole, activeView)}
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowSearchResults(true)}
              />
              {searchTerm && (
                <button
                  className="clear-search-btn"
                  onClick={() => {
                    clearSearch();
                    setShowSearchResults(false);
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="header-right">
            <button
              className="header-btn"
              title={`${approvalCount} pending approvals`}
              onClick={() => setActiveView("approvals")}
            >
              <Bell size={20} />
              {approvalCount > 0 && (
                <span className="notification-badge">{approvalCount}</span>
              )}
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

        {/* Search Results Overlay */}
        {showSearchResults && (
          <SearchResults
            results={searchResults}
            isSearching={isSearching}
            searchTerm={searchTerm}
            onClose={() => setShowSearchResults(false)}
            onItemClick={handleSearchResultClick}
          />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SearchProvider>
      <HomeContent />
    </SearchProvider>
  );
}
