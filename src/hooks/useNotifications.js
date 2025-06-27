import { useState, useEffect } from "react";

export const useNotifications = () => {
  const [approvalCount, setApprovalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchApprovalCount = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/pending-approvals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const count = data.approvals?.length || 0;
        setApprovalCount(count);
      } else {
        setApprovalCount(0);
      }
    } catch (error) {
      console.error("Error fetching approval count:", error);
      setApprovalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalCount();

    // Refresh approval count every 30 seconds
    const interval = setInterval(fetchApprovalCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    approvalCount,
    loading,
    refreshCount: fetchApprovalCount,
  };
};
