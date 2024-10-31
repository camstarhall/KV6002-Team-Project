import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import charityLogo from "../assets/logo.jpg"; // Update the path as necessary
import "../App.css"; // Importing App.css from the src directory

function Header() {
  return (
    <Box>
      {/* Top Part of the Header */}
      <Box
        sx={{
          backgroundColor: "#7B3F3F", // Darker shade
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', flexGrow: 1 }}>
          Together we can make a difference
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white' }}>
          Language
        </Button>
      </Box>

      {/* Bottom Part of the Header */}
      <Box
        sx={{
          backgroundColor: "#D08C8C", // Lighter shade
          display: "flex",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <img src={charityLogo} alt="Charity Logo" style={{ width: '150px', marginRight: 'auto' }} />
        <nav style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          <Link to="/" style={{ margin: '0 1rem', color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>Home</Link>
          <Link to="/events" style={{ margin: '0 1rem', color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>Events</Link>
          <Link to="/about" style={{ margin: '0 1rem', color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>About Us</Link>
          <Link to="/help" style={{ margin: '0 1rem', color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>Help Centre</Link>
          <Link to="/events-list-admin-view" style={{ margin: '0 1rem', color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>Events Admin View </Link> {/* Admin Events link */}
          <Link to="/login" style={{ margin: '0 1rem', color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
        </nav>
      </Box>
    </Box>
  );
}

export default Header;
