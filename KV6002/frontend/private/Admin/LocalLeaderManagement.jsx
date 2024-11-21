// src/components/LocalLeaderManagement.jsx

import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const LocalLeaderManagement = () => {
  const [leaders, setLeaders] = useState(JSON.parse(localStorage.getItem("localLeaders")) || []);
  const [leaderData, setLeaderData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Female",
    address: "",
    password: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState(null);

  useEffect(() => {
    const storedLeaders = JSON.parse(localStorage.getItem("localLeaders")) || [];
    setLeaders(storedLeaders);
  }, []);

  const handleAddLeader = () => {
    if (!leaderData.fullName || !leaderData.email || !leaderData.phone || !leaderData.address || !leaderData.password) {
      alert("Please fill out all required fields.");
      return;
    }

    const newLeaders = [...leaders, { ...leaderData, id: new Date().getTime() }];
    setLeaders(newLeaders);
    localStorage.setItem("localLeaders", JSON.stringify(newLeaders));
    setLeaderData({
      fullName: "",
      email: "",
      phone: "",
      gender: "Female",
      address: "",
      password: ""
    });
  };

  const handleDeleteLeader = (id) => {
    const updatedLeaders = leaders.filter((leader) => leader.id !== id);
    setLeaders(updatedLeaders);
    localStorage.setItem("localLeaders", JSON.stringify(updatedLeaders));
  };

  const handleEditLeader = (leader) => {
    setLeaderData(leader);
    setIsEditing(true);
    setEditingLeaderId(leader.id);
  };

  const handleSaveEdit = () => {
    const updatedLeaders = leaders.map((leader) =>
      leader.id === editingLeaderId ? { ...leader, ...leaderData } : leader
    );
    setLeaders(updatedLeaders);
    localStorage.setItem("localLeaders", JSON.stringify(updatedLeaders));
    setIsEditing(false);
    setEditingLeaderId(null);
    setLeaderData({
      fullName: "",
      email: "",
      phone: "",
      gender: "Female",
      address: "",
      password: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaderData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Box sx={{ backgroundColor: "#f8e8e8", padding: "1rem", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>Manage Local Leaders</Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Full Name"
          name="fullName"
          value={leaderData.fullName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={leaderData.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={leaderData.phone}
          onChange={handleInputChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={leaderData.gender}
            onChange={handleInputChange}
          >
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Home Address"
          name="address"
          value={leaderData.address}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={leaderData.password}
          onChange={handleInputChange}
          fullWidth
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#7B3F3F", color: "white" }}
          onClick={isEditing ? handleSaveEdit : handleAddLeader}
        >
          {isEditing ? "Save Changes" : "Add Leader"}
        </Button>
      </Box>

      <List>
        {leaders.map((leader) => (
          <ListItem
            key={leader.id}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "4px",
              boxShadow: 1,
              mb: 1,
              padding: "0.5rem 1rem",
              "&:hover": { backgroundColor: "#f0d6d6" },
            }}
          >
            <ListItemText
              primary={
                <Typography sx={{ color: "#7B3F3F" }}>{leader.fullName}</Typography>
              }
              secondary={
                <>
                  <Typography sx={{ color: "black" }}>Email: {leader.email}</Typography>
                  <Typography sx={{ color: "black" }}>Phone: {leader.phone}</Typography>
                  <Typography sx={{ color: "black" }}>Gender: {leader.gender}</Typography>
                  <Typography sx={{ color: "black" }}>Address: {leader.address}</Typography>
                </>
              }
            />
            <IconButton color="primary" onClick={() => handleEditLeader(leader)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleDeleteLeader(leader.id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
        <DialogTitle>Edit Local Leader</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            name="fullName"
            value={leaderData.fullName}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={leaderData.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={leaderData.phone}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={leaderData.gender}
              onChange={handleInputChange}
            >
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Home Address"
            name="address"
            value={leaderData.address}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ backgroundColor: "#7B3F3F", color: "white" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocalLeaderManagement;
