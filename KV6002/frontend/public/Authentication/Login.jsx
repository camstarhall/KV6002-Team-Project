import React, { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verify user role in Firestore
      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          setErrorMessage("Access denied. You are not an admin.");
        }
      } else {
        setErrorMessage("User record not found in the database.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage(
        error.message.includes("auth/invalid-credential")
          ? "Invalid email or password."
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
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
        backgroundColor: "#f8e8e8",
        padding: "2rem",
      }}
    >
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 3 }}>
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        {errorMessage && (
          <Typography variant="body2" sx={{ color: "red", mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ backgroundColor: "#7B3F3F", color: "white" }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </form>
    </Box>
  );
}

export default Login;
