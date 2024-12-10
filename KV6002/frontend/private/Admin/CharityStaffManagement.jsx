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
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  const validateData = () => {
    const { fullName, email, phone, position, password } = staffData;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !position.trim() || !password.trim()) {
      setErrorMessage("Please fill out all required fields.");
      return false;
    }

    const nameRegex = /^[a-zA-Z\s'-]{2,}$/;

    if (!nameRegex.test(fullName)) {
      setErrorMessage("Full name must contain at least 2 alphabetic characters and no digits.");
      return false;
    }

    if (!nameRegex.test(position)) {
      setErrorMessage("Position must contain at least 2 alphabetic characters and no digits.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage("Phone number must be 10-15 digits long.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const checkForDuplicates = async () => {
    const staffCollection = collection(db, "CharityStaff");
    const emailQuery = query(staffCollection, where("email", "==", staffData.email));
    const phoneQuery = query(staffCollection, where("phone", "==", staffData.phone));

    const emailSnapshot = await getDocs(emailQuery);
    const phoneSnapshot = await getDocs(phoneQuery);

    if (!emailSnapshot.empty && (!isEditing || editingStaffId !== emailSnapshot.docs[0].id)) {
      setErrorMessage("A staff member with this email already exists.");
      return true;
    }

    if (!phoneSnapshot.empty && (!isEditing || editingStaffId !== phoneSnapshot.docs[0].id)) {
      setErrorMessage("A staff member with this phone number already exists.");
      return true;
    }

    return false;
  };

  const handleAddStaff = async () => {
    if (!validateData()) return;

    const isDuplicate = await checkForDuplicates();
    if (isDuplicate) return;

    try {
      const sanitizedData = {
        ...staffData,
        fullName: staffData.fullName.trim(),
        email: staffData.email.trim(),
        phone: staffData.phone.trim(),
        position: staffData.position.trim(),
        password: staffData.password.trim(),
      };
      const staffCollection = collection(db, "CharityStaff");
      await addDoc(staffCollection, sanitizedData);
      fetchStaff();
      setSuccessMessage("Staff member added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding staff member:", error);
    }
  };

  const handleEditStaff = (member) => {
    setStaffData(member);
    setIsEditing(true);
    setEditingStaffId(member.id);
  };

  const handleSaveEdit = async () => {
    if (!validateData()) return;

    const isDuplicate = await checkForDuplicates();
    if (isDuplicate) return;

    try {
      const sanitizedData = {
        ...staffData,
        fullName: staffData.fullName.trim(),
        email: staffData.email.trim(),
        phone: staffData.phone.trim(),
        position: staffData.position.trim(),
        password: staffData.password.trim(),
      };
      const staffDoc = doc(db, "CharityStaff", editingStaffId);
      await updateDoc(staffDoc, sanitizedData);
      fetchStaff();
      setSuccessMessage("Staff member updated successfully!");
      resetForm();
    } catch (error) {
      console.error("Error updating staff member:", error);
    }
  };

  const resetForm = () => {
    setStaffData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      gender: "Female",
      password: "",
    });
    setIsEditing(false);
    setEditingStaffId(null);
  };

  const handleOpenDeleteDialog = (member) => {
    setStaffToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setStaffToDelete(null);
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      const staffDoc = doc(db, "CharityStaff", staffToDelete.id);
      await deleteDoc(staffDoc);
      fetchStaff();
      setSuccessMessage("Staff member deleted successfully!");
    } catch (error) {
      console.error("Error deleting staff member:", error);
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

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Full Name *"
          name="fullName"
          value={staffData.fullName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Email *"
          name="email"
          type="email"
          value={staffData.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Phone *"
          name="phone"
          value={staffData.phone}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Position *"
          name="position"
          value={staffData.position}
          onChange={handleInputChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select name="gender" value={staffData.gender} onChange={handleInputChange}>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Temporary Password *"
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
              primary={<Typography sx={{ color: "#7B3F3F" }}>{member.fullName}</Typography>}
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

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the staff member "{staffToDelete?.fullName}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteStaff} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CharityStaffManagement;
