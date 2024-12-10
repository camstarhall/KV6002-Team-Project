// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { loginCookieSet, existingLoginCheck, logoutUser } from "./cookieHandling";

const db = getFirestore();

// Inactivity timer (in milliseconds)
const INACTIVITY_TIME = 2 * 60 * 1000; // 2 minutes

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const alreadyLoggedIn = existingLoginCheck();

    let inactivityTimer;

    // Queries a given collection by email field
    async function getUserByEmail(collectionName, userEmail) {
        const q = query(collection(db, collectionName), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        return querySnapshot.docs[0].data();
    }

    async function validateUser(userEmail, passwordInput) {
        // Check Admin collection
        let userData = await getUserByEmail("Admin", userEmail);
        if (userData) {
            if (userData.password !== passwordInput) throw new Error("Invalid password");
            return userData; // role: 'admin'
        }

        // Check CharityStaff collection
        userData = await getUserByEmail("CharityStaff", userEmail);
        if (userData) {
            if (userData.password !== passwordInput) throw new Error("Invalid password");
            return userData; // role: 'charity staff'
        }

        // Check LocalLeaders collection
        userData = await getUserByEmail("LocalLeaders", userEmail);
        if (userData) {
            if (userData.password !== passwordInput) throw new Error("Invalid password");
            return userData; // role: 'local leader'
        }

        throw new Error("User not found");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const userData = await validateUser(email, password);

            // User valid
            loginCookieSet(email);
            console.log("Login successful:", email, "Role:", userData.role);

            // Redirect based on role
            if (userData.role === "admin") {
                navigate("/admin-dashboard");
            } else if (userData.role === "charity staff") {
                navigate("/staff-dashboard");
            } else if (userData.role === "local leader") {
                navigate("/leader-dashboard");
            } else {
                setErrorMessage("Your account role is not recognized. Please contact support.");
            }

            // Start inactivity timer after login
            startInactivityTimer();
        } catch (error) {
            setErrorMessage(
                error.message === "User not found" || error.message === "Invalid password"
                    ? "Invalid email or password. Please try again."
                    : "An unexpected error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        window.location.reload();
    };

    // Start inactivity timer, logs out after 2 minutes of inactivity
    function startInactivityTimer() {
        resetInactivityTimer();
        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keydown', resetInactivityTimer);
    }

    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            // Inactive for 2 minutes, logout
            logoutUser();
            window.location.reload();
        }, INACTIVITY_TIME);
    }

    useEffect(() => {
        if (alreadyLoggedIn) {
            // If already logged in, start inactivity timer
            startInactivityTimer();
        }
        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener('mousemove', resetInactivityTimer);
            window.removeEventListener('keydown', resetInactivityTimer);
        };
    }, [alreadyLoggedIn]);

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
            <Typography variant="h4" sx={{ color: "white", mb: 3 }}>
                Login
            </Typography>

            {alreadyLoggedIn ? (
                <Box sx={{ textAlign: "center", color: "white" }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
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
                <form onSubmit={handleSubmit} style={{ width: "300px" }}>
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
                        sx={{ backgroundColor: "#7B3F3F", color: "white" }}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            )}

            {errorMessage && (
                <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage("")}>
                    <Alert severity="error">{errorMessage}</Alert>
                </Snackbar>
            )}
        </Box>
    );
}

export default Login;
