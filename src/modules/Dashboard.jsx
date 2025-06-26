import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Shield,
  Clock,
  MoreVertical,
  Calendar,
  Award,
  Activity,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Star,
  Target,
  Bell,
  Zap,
  PieChart,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = ({ userRole, userInfo }) => {
  const [timeOfDay, setTimeOfDay] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 17) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPersonalizedStats = () => {
    const baseStats = {
      admin: [
        {
          title: "Total Forms",
          value: "156",
          change: "+12",
          trend: "up",
          icon: FileText,
          color: "#3b82f6",
          gradient: "from-blue-500 to-blue-600",
          description: "Active system forms",
        },
        {
          title: "Pending Reviews",
          value: "47",
          change: "+8",
          trend: "up",
          icon: Clock,
          color: "#f59e0b",
          gradient: "from-amber-500 to-orange-500",
          description: "Awaiting approval",
        },
        {
          title: "Users Active",
          value: "1,284",
          change: "+156",
          trend: "up",
          icon: Users,
          color: "#10b981",
          gradient: "from-emerald-500 to-green-600",
          description: "This month",
        },
        {
          title: "Compliance Score",
          value: "94%",
          change: "+2%",
          trend: "up",
          icon: Shield,
          color: "#8b5cf6",
          gradient: "from-purple-500 to-violet-600",
          description: "Data protection",
        },
      ],
      HOD: [
        {
          title: "Department Forms",
          value: "24",
          change: "+3",
          trend: "up",
          icon: FileText,
          color: "#3b82f6",
          gradient: "from-blue-500 to-blue-600",
          description: "Active dept forms",
        },
        {
          title: "Team Submissions",
          value: "189",
          change: "+23",
          trend: "up",
          icon: Users,
          color: "#10b981",
          gradient: "from-emerald-500 to-green-600",
          description: "This week",
        },
        {
          title: "Pending Approvals",
          value: "12",
          change: "-4",
          trend: "down",
          icon: Clock,
          color: "#f59e0b",
          gradient: "from-amber-500 to-orange-500",
          description: "Requires attention",
        },
        {
          title: "Department Score",
          value: "96%",
          change: "+1%",
          trend: "up",
          icon: Award,
          color: "#8b5cf6",
          gradient: "from-purple-500 to-violet-600",
          description: "Performance rating",
        },
      ],
      "Assistant HOD": [
        {
          title: "Assigned Reviews",
          value: "18",
          change: "+5",
          trend: "up",
          icon: CheckCircle2,
          color: "#3b82f6",
          gradient: "from-blue-500 to-blue-600",
          description: "This week",
        },
        {
          title: "Completed Today",
          value: "7",
          change: "+3",
          trend: "up",
          icon: Target,
          color: "#10b981",
          gradient: "from-emerald-500 to-green-600",
          description: "Reviews processed",
        },
        {
          title: "Department Forms",
          value: "45",
          change: "+2",
          trend: "up",
          icon: FileText,
          color: "#f59e0b",
          gradient: "from-amber-500 to-orange-500",
          description: "Under supervision",
        },
        {
          title: "Efficiency Rate",
          value: "92%",
          change: "+4%",
          trend: "up",
          icon: Activity,
          color: "#8b5cf6",
          gradient: "from-purple-500 to-violet-600",
          description: "This month",
        },
      ],
      user: [
        {
          title: "My Submissions",
          value: "8",
          change: "+2",
          trend: "up",
          icon: FileText,
          color: "#3b82f6",
          gradient: "from-blue-500 to-blue-600",
          description: "This month",
        },
        {
          title: "Pending",
          value: "3",
          change: "0",
          trend: "neutral",
          icon: Clock,
          color: "#f59e0b",
          gradient: "from-amber-500 to-orange-500",
          description: "Under review",
        },
        {
          title: "Approved",
          value: "5",
          change: "+2",
          trend: "up",
          icon: CheckCircle2,
          color: "#10b981",
          gradient: "from-emerald-500 to-green-600",
          description: "Completed",
        },
        {
          title: "Compliance",
          value: "100%",
          change: "0%",
          trend: "neutral",
          icon: Shield,
          color: "#8b5cf6",
          gradient: "from-purple-500 to-violet-600",
          description: "All requirements met",
        },
      ],
    };

    return baseStats[userRole] || baseStats["user"];
  };

  const getRecentActivities = () => {
    const baseActivities = {
      admin: [
        {
          id: "ACT-001",
          title: "New form configuration created",
          description: "ICT Equipment Request Form v2.0",
          user: "System Admin",
          time: "2 hours ago",
          type: "form_created",
          icon: FileText,
          color: "#3b82f6",
        },
        {
          id: "ACT-002",
          title: "User role updated",
          description: "Victor Njoroge assigned as Assistant HOD",
          user: "HR Administrator",
          time: "4 hours ago",
          type: "user_updated",
          icon: Users,
          color: "#10b981",
        },
        {
          id: "ACT-003",
          title: "Compliance report generated",
          description: "Monthly data protection compliance summary",
          user: "Data Protection Officer",
          time: "1 day ago",
          type: "report_generated",
          icon: Shield,
          color: "#8b5cf6",
        },
      ],
      HOD: [
        {
          id: "ACT-001",
          title: "Team submission approved",
          description: "Equipment request from ICT department",
          user: userInfo?.fullName || "You",
          time: "1 hour ago",
          type: "approval_granted",
          icon: CheckCircle2,
          color: "#10b981",
        },
        {
          id: "ACT-002",
          title: "New department form created",
          description: "Security Assessment Form",
          user: "Assistant HOD",
          time: "3 hours ago",
          type: "form_created",
          icon: FileText,
          color: "#3b82f6",
        },
        {
          id: "ACT-003",
          title: "Weekly report submitted",
          description: "Department performance metrics",
          user: "Team Lead",
          time: "1 day ago",
          type: "report_submitted",
          icon: BarChart3,
          color: "#f59e0b",
        },
      ],
      "Assistant HOD": [
        {
          id: "ACT-001",
          title: "Form submission reviewed",
          description: "Equipment request - Approved",
          user: userInfo?.fullName || "You",
          time: "30 minutes ago",
          type: "review_completed",
          icon: Eye,
          color: "#10b981",
        },
        {
          id: "ACT-002",
          title: "Pending approval reminder",
          description: "3 forms awaiting your review",
          user: "System",
          time: "2 hours ago",
          type: "reminder",
          icon: AlertCircle,
          color: "#f59e0b",
        },
        {
          id: "ACT-003",
          title: "Department meeting scheduled",
          description: "Form process improvement discussion",
          user: "HOD",
          time: "4 hours ago",
          type: "meeting_scheduled",
          icon: Calendar,
          color: "#8b5cf6",
        },
      ],
      user: [
        {
          id: "ACT-001",
          title: "Form submission approved",
          description: "Your equipment request has been approved",
          user: "Assistant HOD",
          time: "1 hour ago",
          type: "approval_received",
          icon: CheckCircle2,
          color: "#10b981",
        },
        {
          id: "ACT-002",
          title: "New form available",
          description: "Annual Performance Review Form",
          user: "HR Department",
          time: "1 day ago",
          type: "form_available",
          icon: FileText,
          color: "#3b82f6",
        },
        {
          id: "ACT-003",
          title: "Reminder: Pending submission",
          description: "Training completion certificate due",
          user: "System",
          time: "2 days ago",
          type: "reminder",
          icon: Clock,
          color: "#f59e0b",
        },
      ],
    };

    return baseActivities[userRole] || baseActivities["user"];
  };

  const getQuickActions = () => {
    const actions = {
      admin: [
        { label: "Create Form", icon: FileText, color: "#3b82f6" },
        { label: "Manage Users", icon: Users, color: "#10b981" },
        { label: "View Analytics", icon: BarChart3, color: "#f59e0b" },
        { label: "System Settings", icon: Shield, color: "#8b5cf6" },
      ],
      HOD: [
        { label: "Approve Requests", icon: CheckCircle2, color: "#10b981" },
        { label: "Team Overview", icon: Users, color: "#3b82f6" },
        { label: "Department Report", icon: BarChart3, color: "#f59e0b" },
        { label: "Create Form", icon: FileText, color: "#8b5cf6" },
      ],
      "Assistant HOD": [
        { label: "Review Forms", icon: Eye, color: "#3b82f6" },
        { label: "Pending Approvals", icon: Clock, color: "#f59e0b" },
        { label: "Team Activity", icon: Activity, color: "#10b981" },
        { label: "Schedule Meeting", icon: Calendar, color: "#8b5cf6" },
      ],
      user: [
        { label: "Submit Form", icon: FileText, color: "#3b82f6" },
        { label: "My Requests", icon: Eye, color: "#10b981" },
        { label: "Notifications", icon: Bell, color: "#f59e0b" },
        { label: "Help Center", icon: AlertCircle, color: "#8b5cf6" },
      ],
    };

    return actions[userRole] || actions["user"];
  };

  const stats = getPersonalizedStats();
  const recentActivities = getRecentActivities();
  const quickActions = getQuickActions();

  const getDashboardContent = () => {
    switch (userRole) {
      case "HOD":
        return {
          title: "Department Management Dashboard",
          description:
            "Monitor departmental forms, approvals, and team activities",
          primaryAction: "Create Department Form",
          showCreateForm: true,
        };
      case "Assistant HOD":
        return {
          title: "Assistant HOD Dashboard",
          description:
            "Review pending approvals and monitor departmental activities",
          primaryAction: "View Pending Approvals",
          showCreateForm: false,
        };
      case "admin":
        return {
          title: "Administrator Dashboard",
          description: "Manage system-wide forms, users, and configurations",
          primaryAction: "Create New Form",
          showCreateForm: true,
        };
      case "reviewer":
        return {
          title: "Reviewer Dashboard",
          description: "Review and approve pending form submissions",
          primaryAction: "View Pending Reviews",
          showCreateForm: false,
        };
      case "data_protection_officer":
        return {
          title: "Data Protection Dashboard",
          description:
            "Monitor compliance, audit trails, and data protection activities",
          primaryAction: "View Compliance Report",
          showCreateForm: false,
        };
      case "user":
      default:
        return {
          title: "My Dashboard",
          description: "View your form submissions and request status",
          primaryAction: "Submit New Form",
          showCreateForm: false,
        };
    }
  };

  const dashboardContent = getDashboardContent();

  return (
    <div className="smart-dashboard">
      {/* Enhanced Header with Time and Personalization */}
      <div className="smart-dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Good {timeOfDay}, {userInfo?.firstname || "User"}! 👋
            </h1>
            <h2 className="dashboard-title">{dashboardContent.title}</h2>
            <p className="dashboard-description">
              {dashboardContent.description}
            </p>
            {userInfo?.department && (
              <div className="department-badge">
                <Award size={16} />
                <span>{userInfo.department}</span>
              </div>
            )}
          </div>
          <div className="header-controls">
            <div className="time-display">
              <Calendar size={16} />
              <span>{currentTime.toLocaleDateString()}</span>
              <Clock size={16} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="header-actions">
              <button className="smart-btn secondary">
                <Download size={16} />
                Export Report
              </button>
              <button className="smart-btn primary">
                <Zap size={16} />
                {dashboardContent.primaryAction}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="smart-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`smart-stat-card ${activeMetric === index ? "active" : ""}`}
              onClick={() => setActiveMetric(index)}
            >
              <div className="stat-card-header">
                <div
                  className="stat-icon-wrapper"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <button className="stat-menu-btn">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="stat-card-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
                <p className="stat-description">{stat.description}</p>
                <div className={`stat-trend ${stat.trend}`}>
                  {stat.trend === "up" ? (
                    <TrendingUp size={16} />
                  ) : stat.trend === "down" ? (
                    <TrendingDown size={16} />
                  ) : (
                    <Activity size={16} />
                  )}
                  <span>{stat.change} from last month</span>
                </div>
              </div>
              <div
                className="stat-card-accent"
                style={{ backgroundColor: stat.color }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h3>Quick Actions</h3>
          <p>Frequently used operations</p>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button key={index} className="quick-action-card">
                <div
                  className="action-icon"
                  style={{
                    backgroundColor: `${action.color}15`,
                    color: action.color,
                  }}
                >
                  <Icon size={20} />
                </div>
                <span>{action.label}</span>
                <ChevronRight size={16} className="action-arrow" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="smart-dashboard-content">
        {/* Recent Activities */}
        <div className="content-card activities-card">
          <div className="card-header">
            <div className="header-left">
              <Activity size={20} />
              <h3>Recent Activities</h3>
            </div>
            <div className="header-actions">
              <button className="icon-btn">
                <Filter size={16} />
              </button>
              <button className="icon-btn">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="activity-item">
                  <div
                    className="activity-icon"
                    style={{
                      backgroundColor: `${activity.color}15`,
                      color: activity.color,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <div className="activity-meta">
                      <span className="activity-user">{activity.user}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="content-card performance-card">
          <div className="card-header">
            <div className="header-left">
              <PieChart size={20} />
              <h3>Performance Overview</h3>
            </div>
            <button className="view-details-btn">
              View Details
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="performance-metrics">
            <div className="metric-item">
              <div className="metric-label">Form Completion Rate</div>
              <div className="metric-value">92%</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: "92%", backgroundColor: "#10b981" }}
                ></div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Average Processing Time</div>
              <div className="metric-value">2.4 days</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: "76%", backgroundColor: "#3b82f6" }}
                ></div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label">User Satisfaction</div>
              <div className="metric-value">4.8/5</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: "96%", backgroundColor: "#f59e0b" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
