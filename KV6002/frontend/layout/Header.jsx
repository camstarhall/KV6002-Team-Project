import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import charityLogo from "../assets/Rose_logo.png";
import { existingLoginCheck, logoutUser } from "../public_components/Authentication/cookieHandling";

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = existingLoginCheck(); // checks if username cookie exists

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <Box>
      {/* Top bar */}
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
            width: "100%",
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
          <Link to="/about" style={navLinkStyle}>
            About Us
          </Link>
          <Link to="/help" style={navLinkStyle}>
            Help
          </Link>
          {isLoggedIn ? (
            <Button
              style={navLinkStyle}
              onClick={handleLogout}
              sx={{ backgroundColor: "#7B3F3F", color: "white" }}
            >
              Logout
            </Button>
          ) : (
            <Link to="/login" style={navLinkStyle}>
              Login
            </Link>
          )}
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
