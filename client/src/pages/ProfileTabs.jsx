import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import History from "./History";
import Profile from "./Profile";
import Users from "./Users";
import Report from "./Report"; // ✅ Import Report component
import "../style/ProfileTabs.css";

function ProfileTabs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
    const userId = localStorage.getItem("userId");
  }, []);

  return (
    <div className={`profile-tabs-container ${activeTab === "users" ? "users-background" : ""}`}>
      <div className="content-wrapper">
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="home-button" onClick={() => navigate("/")}>
              <div className="home-logo"></div>
              <span>Home</span>
            </div>
          </div>

          <div className="sidebar-menu">
            <div
              className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Management
            </div>
            <div
              className={`menu-item ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Volunteer History
            </div>
            {isAdmin && (
              <>
                <div
                  className={`menu-item ${activeTab === "users" ? "active" : ""}`}
                  onClick={() => setActiveTab("users")}
                >
                  Manage Users
                </div>
                <div
                  className={`menu-item ${activeTab === "reports" ? "active" : ""}`}
                  onClick={() => setActiveTab("reports")}
                >
                  Reports
                </div>
              </>
            )}
          </div>
        </div>

        <div className="tab-content">
          <div className="content-box">
            {activeTab === "profile" && <Profile />}
            {activeTab === "history" && <History userId={localStorage.getItem("userId")} />}
            {activeTab === "users" && isAdmin && <Users />}
            {activeTab === "reports" && isAdmin && <Report />} {/* ✅ Render Report */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTabs;
