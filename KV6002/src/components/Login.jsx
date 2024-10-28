import React from "react";
import { Box, Typography, TextField, Button, Link } from "@mui/material";

function Login() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh", // Full height
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#D08C8C",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // Align items to the top
          alignItems: "center",
          textAlign: "center",
          paddingTop: "2rem", // Push content higher
        }}
      >
        <Typography
          variant="h2" // Increased size
          sx={{ fontWeight: "bold", marginBottom: "0.5rem", color: "black" }} // Changed text color to black
        >
          ROSE CHARITY
        </Typography>
        <Typography
          variant="h6" // Slightly smaller text
          sx={{ color: "black" }} // Changed text color to black
        >
          You can enjoy managing and booking events with us
        </Typography>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#D08C8C", // Set background color to match left side
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // Align items to the top
          padding: "2rem",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "1rem", color: "black" }}> {/* Changed text color to black */}
          Login to your account
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          sx={{ marginBottom: "1rem" }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          sx={{ marginBottom: "1rem" }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#7B3F3F", // Changed button background color
            color: "white", // Ensure text is readable
            "&:hover": {
              backgroundColor: "#6a3232", // Darker shade on hover
            },
          }}
          fullWidth
        >
          Login
        </Button>
        <Link
          href="/register"
          sx={{
            marginTop: "1rem",
            textAlign: "center",
            display: "block",
            color: "black", // Changed link color to black
          }}
        >
          If you don't have an account yet, click here to register.
        </Link>
      </Box>
    </Box>
  );
}

export default Login;
