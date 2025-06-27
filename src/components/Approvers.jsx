import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  Building,
  Calendar,
  RefreshCw,
  Filter,
  Search,
  Download,
  Eye,
  Signature,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Award,
  Target,
} from "lucide-react";
import { getUserInfo } from "../utils/Auth";
import { useSearch } from "../contexts/SearchContext";
import "./Approvers.css";
import "./local-search.css";

const Approvers = () => {
  const [approvals, setApprovals] = useState([]);
  const [filteredApprovals, setFilteredApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState(""); // 'approve' or 'decline'
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState("");

  const { searchTerm } = useSearch();

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
    loadPendingApprovals();
  }, []);

  useEffect(() => {
    filterApprovals();
  }, [approvals, localSearchTerm, searchTerm, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPendingApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5000/pending-approvals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending approvals");
      }

      const data = await response.json();
      setApprovals(data.approvals || []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading pending approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterApprovals = () => {
    let filtered = approvals;
    const searchToUse = localSearchTerm || searchTerm;

    // Filter by search term (both global and local)
    if (searchToUse) {
      filtered = filtered.filter(
        (approval) =>
          approval.formSlug
            ?.toLowerCase()
            .includes(searchToUse.toLowerCase()) ||
          approval.submittedBy?.department
            ?.toLowerCase()
            .includes(searchToUse.toLowerCase()) ||
          approval.id?.toLowerCase().includes(searchToUse.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (approval) => approval.status === statusFilter,
      );
    }

    setFilteredApprovals(filtered);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending_recommendation":
        return "#f59e0b";
      case "recommended":
        return "#3b82f6";
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const formatFormName = (formSlug) => {
    return formSlug.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getCurrentStage = (approval) => {
    const currentStage = approval.stage;
    const workflow = approval.workflow;

    if (currentStage === "recommendation" && workflow.recommendationBy) {
      return workflow.recommendationBy;
    } else if (currentStage === "issuance" && workflow.issuanceBy) {
      return workflow.issuanceBy;
    } else if (currentStage === "approval" && workflow.approvalBy) {
      return workflow.approvalBy;
    }

    return null;
  };

  const canUserAct = (approval) => {
    const currentStage = getCurrentStage(approval);
    return (
      currentStage &&
      currentStage.uid === userInfo?.uid &&
      currentStage.status === "pending"
    );
  };

  const handleDecision = (approval, type) => {
    setSelectedApproval(approval);
    setDecisionType(type);
    setShowDecisionModal(true);
    setComments("");
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData("");
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      setSignatureData(canvas.toDataURL());
    }
  };

  const submitDecision = async () => {
    if (!selectedApproval || !signatureData) {
      alert("Please provide a signature before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      const decisionData = {
        status: decisionType === "approve" ? "recommended" : "declined",
        by: userInfo.uid,
        name: `${userInfo.firstname} ${userInfo.lastname}`.trim(),
        signature: signatureData,
        comments: comments?.trim() || "",
      };
      console.log("Submitting decision data:", decisionData);

      const response = await fetch(
        `http://localhost:5000/recommend/${selectedApproval.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(decisionData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit decision");
      }

      // Refresh the approvals list
      await loadPendingApprovals();

      // Close modal
      setShowDecisionModal(false);
      setSelectedApproval(null);
      clearCanvas();
    } catch (err) {
      console.error("Error submitting decision:", err);
      alert("Failed to submit decision. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (stage) => {
    switch (stage) {
      case "recommendation":
        return "#f59e0b";
      case "issuance":
        return "#3b82f6";
      case "approval":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="approvers-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <p>Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="approvers-container">
        <div className="error-banner">
          <AlertCircle size={20} />
          <p>{error}</p>
          <button onClick={loadPendingApprovals} className="btn-text">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="approvers-container">
      {/* Header */}
      <div className="approvers-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Award size={24} />
            </div>
            <div>
              <h1>Approval Center</h1>
              <p>Review and process pending form submissions</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <Target size={16} />
              <span className="stat-number">{filteredApprovals.length}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="approvers-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by form name, department, or ID..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending_recommendation">
                Pending Recommendation
              </option>
              <option value="recommended">Recommended</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button className="btn-secondary" onClick={loadPendingApprovals}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Approvals Grid */}
      {filteredApprovals.length === 0 ? (
        <div className="empty-state">
          <Award size={48} />
          <h3>No Pending Approvals</h3>
          <p>All caught up! No forms require your attention at the moment.</p>
        </div>
      ) : (
        <div className="approvals-grid">
          {filteredApprovals.map((approval) => {
            const currentStage = getCurrentStage(approval);
            const canAct = canUserAct(approval);

            return (
              <div key={approval.id} className="approval-card">
                <div className="approval-header">
                  <div className="approval-title">
                    <FileText size={18} />
                    <h3>{formatFormName(approval.formSlug)}</h3>
                  </div>
                  <div className="approval-id">
                    #{approval.id.substring(0, 8)}
                  </div>
                </div>

                <div className="approval-info">
                  <div className="info-row">
                    <Building size={16} />
                    <span>{approval.submittedBy.department}</span>
                  </div>
                  <div className="info-row">
                    <User size={16} />
                    <span>Stage: {approval.stage}</span>
                  </div>
                  <div className="info-row">
                    <Clock size={16} />
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(approval.status)}20`,
                        color: getStatusColor(approval.status),
                      }}
                    >
                      {approval.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {currentStage && (
                  <div className="current-stage">
                    <div className="stage-header">
                      <span className="stage-label">Current Reviewer:</span>
                      <span
                        className="stage-priority"
                        style={{
                          backgroundColor: `${getPriorityColor(approval.stage)}20`,
                          color: getPriorityColor(approval.stage),
                        }}
                      >
                        {approval.stage}
                      </span>
                    </div>
                    <div className="stage-assignee">
                      <strong>{currentStage.name}</strong>
                      <span>
                        {currentStage.role} • {currentStage.department}
                      </span>
                    </div>
                  </div>
                )}

                <div className="approval-actions">
                  <button className="btn-ghost">
                    <Eye size={16} />
                    View Details
                  </button>

                  {canAct && (
                    <div className="decision-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleDecision(approval, "approve")}
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                      <button
                        className="btn-decline"
                        onClick={() => handleDecision(approval, "decline")}
                      >
                        <XCircle size={16} />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Modal */}
      {showDecisionModal && selectedApproval && (
        <div
          className="modal-overlay"
          onClick={() => setShowDecisionModal(false)}
        >
          <div className="decision-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {decisionType === "approve" ? "Approve" : "Decline"} Request
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowDecisionModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="request-summary">
                <h3>{formatFormName(selectedApproval.formSlug)}</h3>
                <p>Request ID: {selectedApproval.id}</p>
                <p>Department: {selectedApproval.submittedBy.department}</p>
              </div>

              <div className="form-group">
                <label>Comments (Optional)</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={`Add comments for your ${decisionType} decision...`}
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div className="signature-section">
                <label>Digital Signature *</label>
                <div className="signature-container">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="signature-canvas"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="signature-hint">
                    Sign above to confirm your decision
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-text"
                  onClick={clearCanvas}
                >
                  Clear Signature
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowDecisionModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className={`btn-primary ${
                  decisionType === "approve" ? "btn-approve" : "btn-decline"
                }`}
                onClick={submitDecision}
                disabled={isSubmitting || !signatureData}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Signature size={16} />
                    {decisionType === "approve" ? "Approve" : "Decline"} Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvers;
