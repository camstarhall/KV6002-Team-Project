import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import charityLogo from "../assets/Rose_logo.png";

function Header() {
  return (
    <Box>
      {/* Top bar with slogan and language button */}
      <Box
        sx={{
          backgroundColor: "#7B3F3F",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Together we can make a difference
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: "green", color: "white" }}>
          Language
        </Button>
      </Box>

      {/* Navigation bar */}
      <Box
        sx={{
          backgroundColor: "#D08C8C",
          display: "flex",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <img
          src={charityLogo}
          alt="Charity Logo"
          style={{ width: "80px", marginRight: "1rem" }}
        />
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%", // Ensures nav links are centered
          }}
        >
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>
          <Link to="/events" style={navLinkStyle}>
            Events
          </Link>
          <Link to="/feedback" style={navLinkStyle}>
            Feedback
          </Link>
          <Link to="/admin-dashboard" style={navLinkStyle}>
            Admin Dashboard
          </Link>
          <Link to="/leader-dashboard" style={navLinkStyle}>
            Local Leader Dashboard
          </Link>
          <Link to="/staff-dashboard" style={navLinkStyle}>
            Staff Dashboard
          </Link>
          <Link to="/login" style={navLinkStyle}>
            Login
          </Link>
        </nav>
      </Box>
    </Box>
  );
}

const navLinkStyle = {
  margin: "0 1.5rem",
  color: "black",
  fontWeight: "bold",
  textDecoration: "none",
};

export default Header;
