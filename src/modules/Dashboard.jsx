import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Shield,
  Clock,
  MoreVertical,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Active Forms",
      value: "12",
      change: "+3",
      trend: "up",
      icon: FileText,
      color: "#3b82f6",
    },
    {
      title: "Pending Requests",
      value: "47",
      change: "+12",
      trend: "up",
      icon: Clock,
      color: "#f59e0b",
    },
    {
      title: "Approved Today",
      value: "23",
      change: "+8",
      trend: "up",
      icon: Shield,
      color: "#10b981",
    },
    {
      title: "Form Submissions",
      value: "1,234",
      change: "+15%",
      trend: "up",
      icon: Users,
      color: "#8b5cf6",
    },
  ];

  const recentRequests = [
    {
      id: "REQ001",
      formTitle: "Data Protection Compliance Assessment",
      requester: "Safaricom PLC",
      type: "New Submission",
      status: "Pending Review",
      date: "2024-01-15",
      priority: "High",
    },
    {
      id: "REQ002",
      formTitle: "Data Breach Incident Report",
      requester: "KCB Bank",
      type: "Amendment Request",
      status: "Under Review",
      date: "2024-01-14",
      priority: "Medium",
    },
    {
      id: "REQ003",
      formTitle: "Privacy Policy Review",
      requester: "Equity Bank",
      type: "New Submission",
      status: "Approved",
      date: "2024-01-13",
      priority: "Low",
    },
    {
      id: "REQ004",
      formTitle: "Data Controller Registration",
      requester: "NHIF",
      type: "Renewal",
      status: "Rejected",
      date: "2024-01-12",
      priority: "High",
    },
  ];

  const formUsageData = [
    { formName: "Compliance Assessment", submissions: 156, completion: 92 },
    { formName: "Incident Report", submissions: 89, completion: 88 },
    { formName: "Privacy Policy Review", submissions: 234, completion: 85 },
    { formName: "Data Controller Registration", submissions: 167, completion: 79 },
    { formName: "Consent Management", submissions: 123, completion: 76 },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Form Management Dashboard</h1>
          <p>Monitor form configurations, requests, and approval workflows</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">Create New Form</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                >
                  <Icon size={24} />
                </div>
                <button className="stat-menu">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{stat.change} from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Form Requests</h2>
            <button className="btn-text">View All</button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Form Title</th>
                  <th>Requester</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="complaint-id">{request.id}</td>
                    <td>{request.formTitle}</td>
                    <td>{request.requester}</td>
                    <td>{request.type}</td>
                    <td>
                      <span className={`status-badge ${request.status.toLowerCase().replace(" ", "-")}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>{request.date}</td>
                    <td>
                      <span className={`priority-badge ${request.priority.toLowerCase()}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Form Usage Analytics</h2>
            <button className="btn-text">View Details</button>
          </div>
          <div className="compliance-list">
            {formUsageData.map((item, index) => (
              <div key={index} className="compliance-item">
                <div className="compliance-info">
                  <h4>{item.formName}</h4>
                  <p>{item.submissions} submissions</p>
                </div>
                <div className="compliance-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.completion}%` }}></div>
                  </div>
                  <span className="compliance-rate">{item.completion}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
