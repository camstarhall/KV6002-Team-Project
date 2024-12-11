// KV6002/frontend/private/CharityStaff/CharityStaffDashboard.jsx
import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import RSVPReport from "../SharedFiles/RSVPReport";
import FeedbackView from "../SharedFiles/FeedbackView";
import UserManagement from "../Admin/UserManagement";
import AttendanceManagement from "../SharedFiles/AttendanceManagement";
import OutreachSummary from "../SharedFiles/OutreachSummary";
import ProtectedRoute from "../../ProtectedRoute"; // Adjust path

const CharityStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ProtectedRoute role="charity staff">
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
  <Tab label="Outreach Summary" />
  <Tab label="Feedback" /> {/* Add Feedback Tab */}
</Tabs>

        </Box>

        {activeTab === 0 && <RSVPReport />}
{activeTab === 1 && <UserManagement />}
{activeTab === 2 && <AttendanceManagement />}
{activeTab === 3 && <OutreachSummary />}
{activeTab === 4 && <FeedbackView />} {/* Render FeedbackView */}

      </Box>
    </ProtectedRoute>
  );
};

export default CharityStaffDashboard;
