// src/components/UserDashboard.jsx

import React from "react";
import { Box, Typography } from "@mui/material";

function UserDashboard() {
  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#F0D0D0", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", textAlign: "center", mb: 3 }}>
        User Dashboard
      </Typography>
      <Typography variant="body1" sx={{ textAlign: "center", color: "#333" }}>
        Welcome to the User Dashboard! Explore available events and manage your bookings.
      </Typography>
    </Box>
  );
}

export default UserDashboard;
