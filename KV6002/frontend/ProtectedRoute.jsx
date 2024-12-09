// KV6002/frontend/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { existingLoginCheck, getCookies } from "./public/Authentication/cookieHandling";

const db = getFirestore();

// Queries a given collection by email field to get user data
async function getUserByEmail(collectionName, userEmail) {
  const q = query(collection(db, collectionName), where("email", "==", userEmail));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  return querySnapshot.docs[0].data();
}

async function getUserRole(userEmail) {
  // Check Admin
  let userData = await getUserByEmail("Admin", userEmail);
  if (userData && userData.role === "admin") return "admin";

  // Check CharityStaff
  userData = await getUserByEmail("CharityStaff", userEmail);
  if (userData && userData.role === "charity staff") return "charity staff";

  // Check LocalLeaders
  userData = await getUserByEmail("LocalLeaders", userEmail);
  if (userData && userData.role === "local leader") return "local leader";

  return null;
}

const ProtectedRoute = ({ role, children }) => {
  const [authorized, setAuthorized] = useState(null); // null = checking, true or false after check

  useEffect(() => {
    const isLoggedIn = existingLoginCheck();
    if (!isLoggedIn) {
      // No username cookie, not logged in
      setAuthorized(false);
      return;
    }

    // If logged in, get the username (email) from cookie
    const userEmail = getCookies("username");
    if (!userEmail) {
      setAuthorized(false);
      return;
    }

    // Check user role from database
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
    return null; // or a loading spinner
  }

  return authorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
