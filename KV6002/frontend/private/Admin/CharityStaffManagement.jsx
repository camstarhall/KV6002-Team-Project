import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Modal,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const CharityStaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [staffData, setStaffData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    gender: "Female",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const staffCollection = collection(db, "CharityStaff");
      const staffDocs = await getDocs(staffCollection);
      const staffData = staffDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleAddStaff = async () => {
    if (!staffData.fullName || !staffData.email || !staffData.phone || !staffData.position || !staffData.password) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const staffCollection = collection(db, "CharityStaff");
      await addDoc(staffCollection, { ...staffData });
      fetchStaff();
      setStaffData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        gender: "Female",
        password: "",
      });
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  const handleEditStaff = (member) => {
    setStaffData(member);
    setIsEditing(true);
    setEditingStaffId(member.id);
  };

  const handleSaveEdit = async () => {
    if (!editingStaffId) return;

    try {
      const staffDoc = doc(db, "CharityStaff", editingStaffId);
      await updateDoc(staffDoc, { ...staffData });
      fetchStaff();
      setIsEditing(false);
      setEditingStaffId(null);
      setStaffData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        gender: "Female",
        password: "",
      });
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleOpenDeleteDialog = (member) => {
    setStaffToDelete(member);
    setDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setStaffToDelete(null);
    setDialogOpen(false);
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      const staffDoc = doc(db, "CharityStaff", staffToDelete.id);
      await deleteDoc(staffDoc);
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Box sx={{ backgroundColor: "#f8e8e8", padding: "2rem", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>
        Manage Charity Staff
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Full Name"
          name="fullName"
          value={staffData.fullName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={staffData.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={staffData.phone}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Position"
          name="position"
          value={staffData.position}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Gender"
          name="gender"
          value={staffData.gender}
          onChange={handleInputChange}
          select
          fullWidth
        >
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
        </TextField>
        <TextField
          label="Temporary Password"
          name="password"
          type="password"
          value={staffData.password}
          onChange={handleInputChange}
          fullWidth
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#7B3F3F", color: "white" }}
          onClick={isEditing ? handleSaveEdit : handleAddStaff}
        >
          {isEditing ? "Save Changes" : "Add Staff"}
        </Button>
      </Box>

      <List>
        {staff.map((member) => (
          <ListItem
            key={member.id}
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
                <Typography sx={{ color: "#7B3F3F" }}>{member.fullName}</Typography>
              }
              secondary={
                <>
                  <Typography sx={{ color: "black" }}>Email: {member.email}</Typography>
                  <Typography sx={{ color: "black" }}>Phone: {member.phone}</Typography>
                  <Typography sx={{ color: "black" }}>Position: {member.position}</Typography>
                  <Typography sx={{ color: "black" }}>Gender: {member.gender}</Typography>
                </>
              }
            />
            <IconButton color="primary" onClick={() => handleEditStaff(member)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleOpenDeleteDialog(member)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the staff member{" "}
            <strong>{staffToDelete?.fullName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteStaff} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CharityStaffManagement;
