import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import {
  loginCookieSet,
  existingLoginCheck,
  logoutUser,
} from "./cookieHandling";

const db = getFirestore();
const INACTIVITY_TIME = 2 * 60 * 1000; // 2 minutes

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const alreadyLoggedIn = existingLoginCheck();
  const isMobile = useMediaQuery("(max-width:600px)");

  let inactivityTimer;

  async function getUserByEmail(collectionName, userEmail) {
    const q = query(
      collection(db, collectionName),
      where("email", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    return querySnapshot.docs[0].data();
  }

  async function validateUser(userEmail, passwordInput) {
    let userData = await getUserByEmail("Admin", userEmail);
    if (userData && userData.password === passwordInput) return userData;

    userData = await getUserByEmail("CharityStaff", userEmail);
    if (userData && userData.password === passwordInput) return userData;

    userData = await getUserByEmail("LocalLeaders", userEmail);
    if (userData && userData.password === passwordInput) return userData;

    throw new Error("User not found");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const userData = await validateUser(email, password);
      loginCookieSet(email);

      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.role === "charity staff") {
        navigate("/staff-dashboard");
      } else if (userData.role === "local leader") {
        navigate("/leader-dashboard");
      } else {
        setErrorMessage(
          "Your account role is not recognized. Please contact support."
        );
      }

      startInactivityTimer();
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    window.location.reload();
  };

  function startInactivityTimer() {
    resetInactivityTimer();
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      logoutUser();
      window.location.reload();
    }, INACTIVITY_TIME);
  }

  useEffect(() => {
    if (alreadyLoggedIn) {
      startInactivityTimer();
    }
    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, [alreadyLoggedIn]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "start",
        justifyContent: "center",
        minHeight: isMobile ? "80vh" : "70vh",
        backgroundColor: "#D08C8C",
        padding: "2rem",
        marginTop: "0rem",
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          textAlign: isMobile ? "center" : "left",
          marginRight: isMobile ? 0 : "5rem",
          marginBottom: isMobile ? "2rem" : 0,
          color: "#7B3F3F",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 1, color: "#000000" }}
        >
          ROSE CHARITY
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 2, color: "#000000" }}
        >
          Admin panel login. Please enter your credentials.
        </Typography>
      </Box>

      {/* Login Form */}
      <Box
        sx={{
          width: isMobile ? "100%" : "400px",
          backgroundColor: "transparent", // Make background transparent
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        {alreadyLoggedIn ? (
          <Box sx={{ textAlign: "center", color: "#7B3F3F" }}>
            <Typography
              variant="body1"
              sx={{ mb: 2 }}
            >
              You are already logged in.
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#7B3F3F", color: "white" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h6"
              sx={{ color: "#7B3F3F", mb: 2 }}
            >
              Login to your account
            </Typography>
            <TextField
              label="Email"
              type="text"
              fullWidth
              sx={{ mb: 2, backgroundColor: "white" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              sx={{ mb: 2, backgroundColor: "white" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#7B3F3F",
                color: "white",
                "&:hover": { backgroundColor: "#5a2e2e" },
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        )}
      </Box>

      {/* Error Message Snackbar */}
      {errorMessage && (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default Login;
