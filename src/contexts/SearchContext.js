import React, { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  // Search function that adapts based on current view
  const performSearch = async (term, view = activeView) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchByView(term, view);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Search logic based on current view/page
  const searchByView = async (term, view) => {
    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    switch (view) {
      case "requests":
        return await searchFormRequests(term, headers);
      case "approvals":
        return await searchApprovals(term, headers);
      case "configurations":
        return await searchFormConfigurations(term, headers);
      case "user-management":
        return await searchUsers(term, headers);
      case "dashboard":
      default:
        return await searchGlobal(term, headers);
    }
  };

  // Search form requests
  const searchFormRequests = async (term, headers) => {
    try {
      const userRole = localStorage.getItem("userRole");
      const endpoint =
        userRole === "admin"
          ? "http://localhost:5000/all"
          : "http://localhost:5000/mine";

      const response = await fetch(endpoint, { headers });
      const data = await response.json();

      return (
        data.submissions?.filter(
          (submission) =>
            submission.formSlug?.toLowerCase().includes(term.toLowerCase()) ||
            submission.submittedBy?.department
              ?.toLowerCase()
              .includes(term.toLowerCase()) ||
            submission.submittedBy?.name
              ?.toLowerCase()
              .includes(term.toLowerCase()) ||
            submission.id?.toLowerCase().includes(term.toLowerCase()),
        ) || []
      );
    } catch (error) {
      console.error("Error searching form requests:", error);
      return [];
    }
  };

  // Search approvals
  const searchApprovals = async (term, headers) => {
    try {
      const response = await fetch("http://localhost:5000/pending-approvals", {
        headers,
      });
      const data = await response.json();

      return (
        data.approvals?.filter(
          (approval) =>
            approval.formSlug?.toLowerCase().includes(term.toLowerCase()) ||
            approval.submittedBy?.department
              ?.toLowerCase()
              .includes(term.toLowerCase()) ||
            approval.id?.toLowerCase().includes(term.toLowerCase()),
        ) || []
      );
    } catch (error) {
      console.error("Error searching approvals:", error);
      return [];
    }
  };

  // Search form configurations (placeholder - depends on your backend)
  const searchFormConfigurations = async (term, headers) => {
    try {
      // This would need to be implemented based on your form configurations endpoint
      // For now, return empty array as placeholder
      return [];
    } catch (error) {
      console.error("Error searching form configurations:", error);
      return [];
    }
  };

  // Search users (placeholder - depends on your backend)
  const searchUsers = async (term, headers) => {
    try {
      // This would need to be implemented based on your user management endpoint
      // For now, return empty array as placeholder
      return [];
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  };

  // Global search across multiple data types
  const searchGlobal = async (term, headers) => {
    try {
      const [requests, approvals] = await Promise.all([
        searchFormRequests(term, headers),
        searchApprovals(term, headers),
      ]);

      return [
        ...requests.map((item) => ({ ...item, type: "request" })),
        ...approvals.map((item) => ({ ...item, type: "approval" })),
      ];
    } catch (error) {
      console.error("Error in global search:", error);
      return [];
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  // Update search when term changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeView]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    activeView,
    setActiveView,
    performSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
