// src/components/LeaderRegisterUser.jsx

import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const LeaderRegisterUser = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterUser = () => {
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    users.push({ ...userData, registeredBy: "Local Leader" });
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    alert("User registered by Local Leader!");
  };

  return (
    <Box>
      <Typography variant="h5">Register User on Behalf</Typography>
      <TextField label="Full Name" name="fullName" onChange={handleInputChange} />
      <TextField label="Phone Number" name="phoneNumber" onChange={handleInputChange} />
      <TextField label="Address" name="address" onChange={handleInputChange} />
      <Button onClick={handleRegisterUser}>Register User</Button>
    </Box>
  );
};

export default LeaderRegisterUser;
