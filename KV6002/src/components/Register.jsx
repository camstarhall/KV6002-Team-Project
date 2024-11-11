import React, { useState } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register() {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",
    employmentStatus: "Unemployed",
    salary: "",
    gender: "Female",
    address: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const normalUsers = JSON.parse(localStorage.getItem("normalUsers")) || [];

    // Check for unique email
    const emailExists = normalUsers.some(user => user.email === userData.email);
    if (emailExists) {
      alert("Email already registered. Please use a different email.");
      return;
    }

    // Add new user and save to local storage
    normalUsers.push(userData);
    localStorage.setItem("normalUsers", JSON.stringify(normalUsers));
    
    // Log users to confirm registration
    console.log("Normal Users stored in localStorage:", normalUsers);

    alert("Registration successful!");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#D08C8C" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Normal User Registration</Typography>
      <form onSubmit={handleRegister} style={{ width: "300px" }}>
        <TextField
          label="Full Name"
          name="fullName"
          fullWidth
          required
          value={userData.fullName}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          value={userData.email}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          fullWidth
          required
          value={userData.phoneNumber}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Country"
          name="country"
          fullWidth
          required
          value={userData.country}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Employment Status</InputLabel>
          <Select
            name="employmentStatus"
            value={userData.employmentStatus}
            onChange={handleInputChange}
          >
            <MenuItem value="Employed">Employed</MenuItem>
            <MenuItem value="Unemployed">Unemployed</MenuItem>
          </Select>
        </FormControl>
        {userData.employmentStatus === "Employed" && (
          <TextField
            label="Salary"
            name="salary"
            type="number"
            fullWidth
            value={userData.salary}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        )}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={userData.gender}
            onChange={handleInputChange}
          >
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Address"
          name="address"
          fullWidth
          required
          value={userData.address}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          required
          value={userData.password}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#7B3F3F", color: "white" }}>
          Register
        </Button>
      </form>
    </Box>
  );
}

export default Register;
