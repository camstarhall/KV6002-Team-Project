// src/components/Login.jsx

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fetch stored credentials and roles
    const adminEmail = localStorage.getItem("adminEmail");
    const adminPassword = localStorage.getItem("adminPassword");
    const storedLocalLeaders = JSON.parse(localStorage.getItem("localLeaders")) || [];
    const storedNormalUsers = JSON.parse(localStorage.getItem("normalUsers")) || [];

    console.log("Normal Users stored in localStorage:", storedNormalUsers);

    // Check if user is an admin
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("userRole", "admin");
      navigate("/admin-dashboard");
    }
    // Check if user is a local leader
    else if (
      storedLocalLeaders.some((leader) => leader.email === email && leader.password === password)
    ) {
      const leader = storedLocalLeaders.find((leader) => leader.email === email);
      if (!leader.passwordUpdated) {
        localStorage.setItem("userRole", "localLeader");
        localStorage.setItem("email", email); // Save email for reset-password usage
        navigate("/reset-password"); // Force password update
      } else {
        localStorage.setItem("userRole", "localLeader");
        navigate("/leader-dashboard");
      }
    }
    // Check if user is a normal user
    else if (
      storedNormalUsers.some((user) => user.email === email && user.password === password)
    ) {
      console.log("Normal user login successful:", email); // Debugging line for successful login
      localStorage.setItem("userRole", "normalUser");
      navigate("/user-dashboard");
    } else {
      setErrorMessage("Invalid credentials. Please try again.");
      console.log("Login failed: invalid credentials for", email); // Debugging line for failed login
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
      <Typography variant="h4" sx={{ color: "white", mb: 3 }}>Login</Typography>
      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#7B3F3F", color: "white" }}>
          Login
        </Button>
      </form>
      {errorMessage && (
        <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage("")}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default Login;
