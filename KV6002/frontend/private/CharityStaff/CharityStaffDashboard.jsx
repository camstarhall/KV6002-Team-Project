import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import RSVPReport from "../SharedFiles/RSVPReport"; // Import RSVPReport
import UserManagement from "../Admin/UserManagement"; // Import UserManagement
import AttendanceManagement from "../SharedFiles/AttendanceManagement"; // Import AttendanceManagement
import OutreachSummary from "../SharedFiles/OutreachSummary"; // Import OutreachSummary

const CharityStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          color: "#7B3F3F",
          mb: 3,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Charity Staff Dashboard
      </Typography>

      {/* Tabs for switching between sections */}
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
          <Tab label="RSVP Report" />
          <Tab label="User Management" />
          <Tab label="Attendance Management" />
          <Tab label="Outreach Summary" /> {/* New Tab for Outreach Summary */}
        </Tabs>
      </Box>

      {/* Render components based on active tab */}
      {activeTab === 0 && <RSVPReport />}
      {activeTab === 1 && <UserManagement />}
      {activeTab === 2 && <AttendanceManagement />}
      {activeTab === 3 && <OutreachSummary />} {/* Render Outreach Summary */}
    </Box>
  );
};

export default CharityStaffDashboard;
