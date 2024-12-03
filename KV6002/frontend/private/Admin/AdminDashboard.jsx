import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import EventManagement from "./EventManagement";
import RSVPReport from "../SharedFiles/RSVPReport";
import FeedbackView from "./FeedbackView";
import UserManagement from "./UserManagement";
import LocalLeaderManagement from "./LocalLeaderManagement";
import CharityStaffManagement from "./CharityStaffManagement";
import AttendanceManagement from "../SharedFiles/AttendanceManagement";
import OutreachSummary from "../SharedFiles/OutreachSummary"; // Import OutreachSummary

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
            "& .Mui-selected": { color: "#D08C8C" },
          }}
        >
          <Tab label="Event Management" />
          <Tab label="RSVP Report" />
          <Tab label="Feedback" />
          <Tab label="User Management" />
          <Tab label="Local Leader Management" />
          <Tab label="Charity Staff Management" />
          <Tab label="Attendance Management" />
          <Tab label="Outreach Summary" /> {/* New Outreach Summary Tab */}
        </Tabs>
      </Box>

      <Box sx={{ padding: "1rem", backgroundColor: "#F8E8E8", borderRadius: "8px", boxShadow: 3 }}>
        {activeTab === 0 && <EventManagement />}
        {activeTab === 1 && <RSVPReport />}
        {activeTab === 2 && <FeedbackView />}
        {activeTab === 3 && <UserManagement />}
        {activeTab === 4 && <LocalLeaderManagement />}
        {activeTab === 5 && <CharityStaffManagement />}
        {activeTab === 6 && <AttendanceManagement />}
        {activeTab === 7 && <OutreachSummary />} {/* Render Outreach Summary */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
