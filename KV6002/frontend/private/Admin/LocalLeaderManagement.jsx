import React, { useState, useEffect, useRef } from "react";
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
import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const LocalLeaderManagement = () => {
  const [leaders, setLeaders] = useState([]);
  const [leaderData, setLeaderData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Female",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState(null);
  const [dialogType, setDialogType] = useState(""); // "success" or "error"
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaderToDelete, setLeaderToDelete] = useState(null);

  // Ref for the form container to scroll into view
  const formRef = useRef(null);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const leadersCollection = collection(db, "LocalLeaders");
      const leaderDocs = await getDocs(leadersCollection);
      const leaderData = leaderDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLeaders(leaderData);
    } catch (error) {
      showDialog("error", "Error fetching leaders. Please try again.");
    }
  };

  const validateData = () => {
    const { fullName, email, phone, password } = leaderData;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      showDialog("error", "Please fill out all required fields.");
      return false;
    }

    const nameRegex = /^[a-zA-Z\s'-]{2,}$/;
    if (!nameRegex.test(fullName)) {
      showDialog("error", "Full name must contain at least 2 alphabetic characters and no digits.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showDialog("error", "Please enter a valid email address.");
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      showDialog("error", "Phone number must be 10-15 digits long.");
      return false;
    }

    return true;
  };

  const showDialog = (type, message) => {
    setDialogType(type);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddLeader = async () => {
    if (!validateData()) return;

    try {
      const sanitizedData = {
        ...leaderData,
        fullName: leaderData.fullName.trim(),
        email: leaderData.email.trim(),
        phone: leaderData.phone.trim(),
        password: leaderData.password.trim(),
      };
      const leadersCollection = collection(db, "LocalLeaders");
      await addDoc(leadersCollection, sanitizedData);
      fetchLeaders();
      showDialog("success", "Leader added successfully!");
      resetForm();
    } catch (error) {
      showDialog("error", "Error adding leader. Please try again.");
    }
  };

  const handleEditLeader = (leader) => {
    resetForm(); // Ensure the form is reset before editing a new leader
    setLeaderData(leader);
    setIsEditing(true);
    setEditingLeaderId(leader.id);

    // Scroll to the form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSaveEdit = async () => {
    if (!validateData()) return;

    try {
      const sanitizedData = {
        ...leaderData,
        fullName: leaderData.fullName.trim(),
        email: leaderData.email.trim(),
        phone: leaderData.phone.trim(),
        password: leaderData.password.trim(),
      };
      const leaderDoc = doc(db, "LocalLeaders", editingLeaderId);
      await updateDoc(leaderDoc, sanitizedData);
      fetchLeaders();
      showDialog("success", "Leader updated successfully!");
      resetForm();
    } catch (error) {
      showDialog("error", "Error updating leader. Please try again.");
    }
  };

  const resetForm = () => {
    setLeaderData({
      fullName: "",
      email: "",
      phone: "",
      gender: "Female",
      password: "",
    });
    setIsEditing(false);
    setEditingLeaderId(null);
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
      showDialog("success", "Leader deleted successfully!");
    } catch (error) {
      showDialog("error", "Error deleting leader. Please try again.");
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaderData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Box sx={{ backgroundColor: "#f8e8e8", padding: "2rem", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>
        Manage Local Leaders
      </Typography>

      <Box ref={formRef} sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Full Name *"
          name="fullName"
          value={leaderData.fullName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Email *"
          name="email"
          type="email"
          value={leaderData.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Phone *"
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
          label="Temporary Password *"
          name="password"
          type="password"
          value={leaderData.password}
          onChange={handleInputChange}
          fullWidth
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#7B3F3F", color: "white" }}
            onClick={isEditing ? handleSaveEdit : handleAddLeader}
          >
            {isEditing ? "Save Changes" : "Add Leader"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={resetForm}>
            Clear
          </Button>
        </Box>
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{dialogType === "success" ? "Success" : "Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

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
