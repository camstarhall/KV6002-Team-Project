import React from "react";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import charityLogo from "../assets/Rose_logo.png";
import {
  existingLoginCheck,
  logoutUser,
} from "../public_components/Authentication/cookieHandling";

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = existingLoginCheck(); // checks if username cookie exists

  // Media query for small screens (phones and small devices)
  const isSmallScreen = useMediaQuery("(max-width:600px)");

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
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontSize: isSmallScreen ? "1rem" : "1.25rem", // Adjust font size for small screens
          }}
        >
          Together we can make a difference
        </Typography>

        {/* Grouped Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: isSmallScreen ? "0.25rem" : "0.5rem", // Adjust spacing between buttons
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "green",
              color: "white",
              fontSize: isSmallScreen ? "0.75rem" : "1rem", // Smaller font for small screens
              padding: isSmallScreen ? "0.25rem 0.5rem" : "0.5rem 1rem",
            }}
          >
            Donate
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "green",
              color: "white",
              fontSize: isSmallScreen ? "0.75rem" : "1rem",
              padding: isSmallScreen ? "0.25rem 0.5rem" : "0.5rem 1rem",
            }}
          >
            Zakat
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "green",
              color: "white",
              fontSize: isSmallScreen ? "0.75rem" : "1rem",
              padding: isSmallScreen ? "0.25rem 0.5rem" : "0.5rem 1rem",
            }}
          >
            Language
          </Button>
        </Box>
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
        {/* Hide logo on small screens */}
        {!isSmallScreen && (
          <img
            src={charityLogo}
            alt="Charity Logo"
            style={{ width: "80px", marginRight: "1rem" }}
          />
        )}
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Link
            to="/"
            style={{
              ...navLinkStyle,
              margin: isSmallScreen ? "0 0.5rem" : "0 1.5rem", // Reduced spacing on small screens
            }}
          >
            Home
          </Link>
          <Link
            to="/events"
            style={{
              ...navLinkStyle,
              margin: isSmallScreen ? "0 0.5rem" : "0 1.5rem",
            }}
          >
            Events
          </Link>
          <Link
            to="/feedback"
            style={{
              ...navLinkStyle,
              margin: isSmallScreen ? "0 0.5rem" : "0 1.5rem",
            }}
          >
            Feedback
          </Link>
          <Link
            to="/about"
            style={{
              ...navLinkStyle,
              margin: isSmallScreen ? "0 0.5rem" : "0 1.5rem",
            }}
          >
            About Us
          </Link>
          <Link
            to="/help"
            style={{
              ...navLinkStyle,
              margin: isSmallScreen ? "0 0.5rem" : "0 1.5rem",
            }}
          >
            Help
          </Link>
          {isLoggedIn ? (
            <Button
              style={{
                ...navLinkStyle,
                margin: isSmallScreen ? "0 0.5rem" : "0 1.5rem", // Reduced spacing for small screens
              }}
              onClick={handleLogout}
              sx={{
                backgroundColor: "#7B3F3F",
                color: "white",
                fontSize: isSmallScreen ? "0.75rem" : "1rem", // Smaller font for logout button
              }}
            >
              Logout
            </Button>
          ) : (
            <Link
              to="/login"
              style={{
                ...navLinkStyle,
                margin: isSmallScreen ? "0 0.5rem" : "0 1.5rem", // Reduced spacing for small screens
              }}
            >
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
