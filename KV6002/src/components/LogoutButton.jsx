// src/components/LogoutButton.jsx

import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole"); // Clear user role
    localStorage.removeItem("email"); // Clear stored email if used
    navigate("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="contained"
      sx={{ backgroundColor: "#7B3F3F", color: "white", ml: 2 }}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
