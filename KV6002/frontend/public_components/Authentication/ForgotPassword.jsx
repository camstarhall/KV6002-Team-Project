// src/components/ForgotPassword.jsx

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestReset = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const localLeaders = JSON.parse(localStorage.getItem("localLeaders")) || [];
    const allUsers = [...users, ...localLeaders];
    const user = allUsers.find((u) => u.email === email);

    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
      user.resetCode = code;
      localStorage.setItem(user.role === "localLeader" ? "localLeaders" : "users", JSON.stringify(allUsers));
      setResetCode(code);
    } else {
      setErrorMessage("No account found with this email.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#D08C8C",
      }}
    >
      <Typography variant="h4" sx={{ color: "white", mb: 3 }}>Forgot Password</Typography>
      <TextField
        label="Email"
        fullWidth
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button
        variant="contained"
        onClick={handleRequestReset}
        fullWidth
        sx={{ backgroundColor: "#7B3F3F", color: "white", mb: 2 }}
      >
        Request Reset Code
      </Button>
      {resetCode && (
        <Typography sx={{ color: "white", mb: 2 }}>
          Your reset code is: {resetCode}
        </Typography>
      )}
      {errorMessage && (
        <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage("")}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}
      <Button onClick={() => navigate("/reset-password")} sx={{ color: "white" }}>
        Proceed to Reset Password
      </Button>
    </Box>
  );
}

export default ForgotPassword;
