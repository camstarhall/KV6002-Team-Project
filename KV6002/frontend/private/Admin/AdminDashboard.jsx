// src/components/AdminDashboard.jsx

import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import LocalLeaderManagement from "./LocalLeaderManagement";
import UserManagement from "./UserManagement";
import EventManagement from "./EventManagement";
import RSVPReport from "../SharedFiles/RSVPReport";
import FeedbackView from "./FeedbackView";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#F8D8D8", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", textAlign: "center", mb: 3 }}>
        Admin Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{ style: { backgroundColor: "#7B3F3F" } }}
          sx={{
            "& .MuiTab-root": { color: "#7B3F3F", fontWeight: "bold" },
            "& .Mui-selected": { color: "#D08C8C" }
          }}
        >
          <Tab label="Local Leader Management" />
          <Tab label="User Management" />
          <Tab label="Event Management" />
          <Tab label="RSVP Report" />
          <Tab label="Feedback" />
        </Tabs>
      </Box>
      
      <Box sx={{ padding: "1rem", backgroundColor: "#F8E8E8", borderRadius: "8px", boxShadow: 3 }}>
        {activeTab === 0 && <LocalLeaderManagement />}
        {activeTab === 1 && <UserManagement />}
        {activeTab === 2 && <EventManagement />}
        {activeTab === 3 && <RSVPReport />}
        {activeTab === 4 && <FeedbackView />}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
