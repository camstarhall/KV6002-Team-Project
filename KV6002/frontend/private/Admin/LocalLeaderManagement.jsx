import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const LocalLeaderManagement = () => {
  const [leaders, setLeaders] = useState([]);
  const [leaderData, setLeaderData] = useState({
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    gender: "Female",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaderToDelete, setLeaderToDelete] = useState(null);

  // Fetch leaders from Firestore
  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const leadersCollection = collection(db, "LocalLeaders");
      const leaderDocs = await getDocs(leadersCollection);
      const leaderData = leaderDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLeaders(leaderData);
    } catch (error) {
      console.error("Error fetching leaders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeader = async () => {
    if (
      !leaderData.fullName ||
      !leaderData.email ||
      !leaderData.phone ||
      !leaderData.dateOfBirth ||
      !leaderData.password
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const leadersCollection = collection(db, "LocalLeaders");
      await addDoc(leadersCollection, leaderData);
      fetchLeaders();
      setLeaderData({
        fullName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        gender: "Female",
        password: "",
      });
    } catch (error) {
      console.error("Error adding leader:", error);
    }
  };

  const handleEditLeader = (leader) => {
    setLeaderData(leader);
    setIsEditing(true);
    setEditingLeaderId(leader.id);
  };

  const handleSaveEdit = async () => {
    if (!editingLeaderId) return;

    try {
      const leaderDoc = doc(db, "LocalLeaders", editingLeaderId);
      await updateDoc(leaderDoc, leaderData);
      fetchLeaders();
      setIsEditing(false);
      setEditingLeaderId(null);
      setLeaderData({
        fullName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        gender: "Female",
        password: "",
      });
    } catch (error) {
      console.error("Error updating leader:", error);
    }
  };

  const handleOpenDeleteDialog = (leader) => {
    setLeaderToDelete(leader);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setLeaderToDelete(null);
  };

  const handleDeleteLeader = async () => {
    if (!leaderToDelete) return;

    try {
      const leaderDoc = doc(db, "LocalLeaders", leaderToDelete.id);
      await deleteDoc(leaderDoc);
      fetchLeaders();
    } catch (error) {
      console.error("Error deleting leader:", error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaderData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Box sx={{ backgroundColor: "#f8e8e8", padding: "1rem", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>
        Manage Local Leaders
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Full Name"
          name="fullName"
          value={leaderData.fullName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={leaderData.dateOfBirth}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
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
          <Select name="gender" value={leaderData.gender} onChange={handleInputChange}>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Temporary Password"
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
              primary={<Typography sx={{ color: "#7B3F3F" }}>{leader.fullName}</Typography>}
              secondary={
                <>
                  <Typography sx={{ color: "black" }}>Email: {leader.email}</Typography>
                  <Typography sx={{ color: "black" }}>Phone: {leader.phone}</Typography>
                  <Typography sx={{ color: "black" }}>Gender: {leader.gender}</Typography>
                  <Typography sx={{ color: "black" }}>Date of Birth: {leader.dateOfBirth}</Typography>
                </>
              }
            />
            <IconButton color="primary" onClick={() => handleEditLeader(leader)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleOpenDeleteDialog(leader)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete local leader "{leaderToDelete?.fullName}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteLeader} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocalLeaderManagement;
