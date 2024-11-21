// src/components/Header.jsx

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import charityLogo from "../assets/Rose_logo.png";

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole"); // Clear the stored user role
    localStorage.removeItem("email"); // Clear stored email if used
    navigate("/login");
  };

  return (
    <Box>
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
          sx={{ color: "white", textAlign: "center", flexGrow: 1 }}
        >
          Together we can make a difference
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "green", color: "white" }}
        >
          Language
        </Button>
      </Box>

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
          style={{ width: "80px", marginRight: "auto" }}
        />
        <nav style={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
          <Link
            to="/"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <Link
            to="/events"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Events
          </Link>
          <Link
            to="/about"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            About Us
          </Link>
          <Link
            to="/feedback"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Feedback
          </Link>
          {!isLoggedIn ? (
            <>
              <Link
                to="/register"
                style={{
                  margin: "0 1rem",
                  color: "black",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
              <Link
                to="/login"
                style={{
                  margin: "0 1rem",
                  color: "black",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                backgroundColor: "#7B3F3F",
                color: "white",
                marginLeft: "1rem",
              }}
            >
              Logout
            </Button>
          )}
        </nav>
      </Box>
    </Box>
  );
}

export default Header;
