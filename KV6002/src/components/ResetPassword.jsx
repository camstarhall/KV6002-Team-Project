// src/components/ResetPassword.jsx

import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const storedLocalLeaders = JSON.parse(localStorage.getItem("localLeaders")) || [];
    const email = localStorage.getItem("email");

    // Update the password and set passwordUpdated to true
    const updatedLeaders = storedLocalLeaders.map((leader) =>
      leader.email === email ? { ...leader, password, passwordUpdated: true } : leader
    );

    localStorage.setItem("localLeaders", JSON.stringify(updatedLeaders));
    localStorage.removeItem("email"); // Clean up email from local storage
    navigate("/leader-dashboard");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor: "#D08C8C", padding: "2rem" }}>
      <Typography variant="h4" sx={{ color: "white", mb: 3 }}>Reset Password</Typography>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        sx={{ mb: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        sx={{ mb: 2 }}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button onClick={handlePasswordReset} variant="contained" sx={{ backgroundColor: "#7B3F3F", color: "white" }}>
        Update Password
      </Button>
      {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}
    </Box>
  );
}

export default ResetPassword;
