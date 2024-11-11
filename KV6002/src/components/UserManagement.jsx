// src/components/UserManagement.jsx

import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

const UserManagement = () => {
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem("normalUsers")) || []);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("normalUsers")) || [];
    setUsers(storedUsers);
  }, []);

  const handleDeleteUser = (email) => {
    const updatedUsers = users.filter((user) => user.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem("normalUsers", JSON.stringify(updatedUsers));
  };

  return (
    <Box sx={{ backgroundColor: "#f8e8e8", padding: "2rem", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>Manage Users</Typography>

      <List>
        {users.map((user, index) => (
          <ListItem
            key={index}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "4px",
              boxShadow: 1,
              mb: 1,
              padding: "1rem",
              "&:hover": { backgroundColor: "#f0d6d6" },
            }}
          >
            <ListItemText
              primary={<Typography sx={{ color: "#7B3F3F", fontWeight: "bold" }}>{user.fullName}</Typography>}
              secondary={
                <>
                  <Typography sx={{ color: "black" }}>Email: {user.email}</Typography>
                  <Typography sx={{ color: "black" }}>Phone Number: {user.phoneNumber}</Typography>
                  <Typography sx={{ color: "black" }}>Country: {user.country}</Typography>
                  <Typography sx={{ color: "black" }}>Employment Status: {user.employmentStatus}</Typography>
                  {user.employmentStatus === "Employed" && (
                    <Typography sx={{ color: "black" }}>Salary: {user.salary}</Typography>
                  )}
                  <Typography sx={{ color: "black" }}>Gender: {user.gender}</Typography>
                  <Typography sx={{ color: "black" }}>Address: {user.address}</Typography>
                </>
              }
            />
            <IconButton color="error" onClick={() => handleDeleteUser(user.email)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserManagement;
