// src/components/Login.jsx
//Relevant packages
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import CryptoJS from "crypto-js"; // Hashing library

const db = getFirestore(); //Initialise firebase connection


//Cookie Check

/*function getCookies(variable)
{
    const cookies = document.cookie.split('; ');

    for (let i of cookies){
        const [key, value] = cookie.split('=');
        
        if (key === variable)
        {
            return value;
        }
    }
    return null;
}
*/

//Checks if there's a user currently logged in.
/*function loginCheck()
{
    const loggedInUser = getCookie('username');

    if (loggedInUser === null)
        {
            navigate('/Login');
        }

    
}
*/

//Initialises user related cookies for login management
/*function loginCookieSet (userhash)
{   
    try{
        const expirationDays = 7; //No. days before cookie data expires.
        const date = new Date();
        date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000) //Converts days to milliseconds.

        //set cookie

        document.cookie = 'username =${username}; expires=${date.toUTCString()}; path=/';
    }

    catch(error){console.log("Cookie setting failed: ", error );}
}
*/

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function checkPwInput(storedHash, pwInput) {
        const pHash = CryptoJS.SHA256(pwInput).toString(CryptoJS.enc.Base64); //Hashed inputted password
        return pHash == storedHash;
    }

    // Validate user credentials with Firestore
    async function validateUser(emailHash, passwordInput) {
        try {
            // Hash email to get document key
            const docRef = doc(db, "Users", emailHash);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error("User not found");
            }

            const userData = docSnap.data(); //Retrieve user attributes from firebase document.
            return checkPwInput(userData.Password, passwordInput); //Check whether password is correct.
        }

        catch (error){console.log("User validation failed: ", error);
            throw error; //ensure the error is outputted
        }

    }

  // Handle form submission
  const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setErrorMessage("");

            try {
                var emailHash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Base64); //Encrypt input 
                const isValidUser = await validateUser(emailHash, password);

                if (isValidUser) {
                    //loginCookieSet(email);
                    console.log("Login successful:", email);
                    navigate("/staff-dashboard"); // Redirect to dashboard
                }
            } catch (error) {
                // Handle user-friendly errors
                setErrorMessage(
                    error.message === "User not found" || error.message === "Invalid password"
                        ? "Invalid email or password. Please try again."
                        : "An unexpected error occurred. Please try again."
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
                    backgroundColor: "#D08C8C",
                }}
            >
                <Typography variant="h4" sx={{ color: "white", mb: 3 }}>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: "300px" }}>
                    <TextField
                        label="Email"
                        type="text"
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
                {errorMessage && (
                    <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage("")}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Snackbar>
                )}
            </Box>
        );
    }

export default Login;