import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import History from "./History";
import Profile from "./Profile";
import "../style/ProfileTabs.css";

function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("history");
  const navigate = useNavigate();

  return (
    <div className="profile-tabs-container">
      {/* Unified Content Wrapper */}
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
          </div>
        </div>
        
        {/* Content Area Inside Same Box */}
        <div className="tab-content">
          <div className="content-box">
            {activeTab === "history" ? <History /> : <Profile />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTabs;
