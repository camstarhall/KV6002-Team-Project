// src/components/LeaderDashboard.jsx

import React from "react";
import { Box, Typography } from "@mui/material";

function LeaderDashboard() {
  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#F0D0D0", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", textAlign: "center", mb: 3 }}>
        Local Leader Dashboard
      </Typography>
      <Typography variant="body1" sx={{ textAlign: "center", color: "#333" }}>
        Welcome to the Local Leader Dashboard! Here, you can manage tasks and assist the community.
      </Typography>
    </Box>
  );
}

export default LeaderDashboard;
