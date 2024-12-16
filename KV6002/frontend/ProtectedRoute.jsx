// KV6002/frontend/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  existingLoginCheck,
  getCookies,
} from "./public_components/Authentication/cookieHandling";
import CryptoJS from "crypto-js";

const db = getFirestore();

// Hashing function to generate the document ID from the user's email
async function hashUserDetails(userInput) {
  const hashed = CryptoJS.SHA256(userInput)
    .toString(CryptoJS.enc.Base64)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return hashed;
}

// Retrieves user data by using the hashed email as the doc ID
// MAKE SURE THIS DOESNT CHANGE TO SEARCHING EMAIL BY FIELD - THE DOCUMENT ID IS A HASHED EMAIL
async function getUserByHashedEmail(collectionName, userEmail) {
  const hashedEmail = await hashUserDetails(userEmail);
  const docRef = doc(db, collectionName, hashedEmail);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }
  return docSnap.data();
}

async function getUserRole(userEmail) {
  // Check Admin
  let userData = await getUserByHashedEmail("Admin", userEmail);
  if (userData && userData.role === "admin") return "admin";

  // Check CharityStaff
  userData = await getUserByHashedEmail("CharityStaff", userEmail);
  if (userData && userData.role === "charity staff") return "charity staff";

  // Check LocalLeaders
  userData = await getUserByHashedEmail("LocalLeaders", userEmail);
  if (userData && userData.role === "local leader") return "local leader";

  return null;
}

const ProtectedRoute = ({ role, children }) => {
  const [authorized, setAuthorized] = useState(null); // null = checking

  useEffect(() => {
    const isLoggedIn = existingLoginCheck();

    if (!isLoggedIn) {
      setAuthorized(false);
      return;
    }

    const userEmail = getCookies("username");
    if (!userEmail) {
      setAuthorized(false);
      return;
    }

    (async () => {
      const userRole = await getUserRole(userEmail);
      if (userRole === role) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    })();
  }, [role]);

  if (authorized === null) {
    // Still checking
    return null; // Could return a loading spinner
  }

  return authorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
