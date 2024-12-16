import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  // Phone extensions
  const phoneExtensions = [
    { label: "Malaysia (+60)", value: "60", minLength: 9, maxLength: 11 },
    { label: "UK (+44)", value: "44", minLength: 10, maxLength: 13 },
    { label: "USA (+1)", value: "1", minLength: 10, maxLength: 11 },
    { label: "India (+91)", value: "91", minLength: 10, maxLength: 12 },
  ];

  // Validation functions
  const isValidName = (name) => /^[A-Za-z\s]+$/.test(name.trim()) && !/^\d+$/.test(name.trim());
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidAddress = (address) => address.trim().length >= 5;
  const normalizePhoneNumber = (phone) => phone.replace(/^0+/, "");
  const isValidPhone = (phone, extension) => {
    const normalizedPhone = normalizePhoneNumber(phone);
    const selectedExtension = phoneExtensions.find((ext) => ext.value === extension);
    if (!selectedExtension) return false;
    const phoneLength = normalizedPhone.length;
    return (
      /^[0-9]+$/.test(normalizedPhone) &&
      phoneLength >= selectedExtension.minLength &&
      phoneLength <= selectedExtension.maxLength
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "Users");
      const userDocs = await getDocs(usersCollection);
      const userData = userDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditUser(null);
    setModalOpen(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setToastOpen(false);

    // Validate name
    if (!isValidName(editUser.fullName)) {
      setError("Please enter a valid name (letters and spaces only).");
      setToastOpen(true);
      return;
    }

    // Validate email (optional but must be valid if provided)
    if (editUser.email && !isValidEmail(editUser.email)) {
      setError("Please enter a valid email address.");
      setToastOpen(true);
      return;
    }

    // Validate phone
    if (!isValidPhone(editUser.phone, editUser.phoneExtension)) {
      setError("Please enter a valid phone number based on the selected extension.");
      setToastOpen(true);
      return;
    }

    // Validate address
    if (!isValidAddress(editUser.address)) {
      setError("Please enter a valid first line of address (at least 5 characters).");
      setToastOpen(true);
      return;
    }

    // Salary validation (if employed)
    if (editUser.employmentStatus === "Employed" && isNaN(editUser.monthlySalary)) {
      setError("Monthly Salary must be a numeric value.");
      setToastOpen(true);
      return;
    }

    try {
      const userDoc = doc(db, "Users", editUser.id);
      await updateDoc(userDoc, editUser);
      fetchUsers();
      setSuccess("User updated successfully.");
      setToastOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
      setError("An error occurred while updating the user.");
      setToastOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  return (
    <Box sx={{ backgroundColor: "#f8e8e8", padding: "2rem", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>
        Manage Users
      </Typography>

      {/* User Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          component="form"
          onSubmit={handleUpdate}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: 2,
            boxShadow: 3,
            width: "400px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit User
          </Typography>
          <TextField
            label="Full Name"
            name="fullName"
            value={editUser?.fullName || ""}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={editUser?.email || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            helperText="Optional, but must be valid if provided"
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Phone Extension</InputLabel>
            <Select
              name="phoneExtension"
              value={editUser?.phoneExtension || "60"}
              onChange={handleInputChange}
            >
              {phoneExtensions.map((ext) => (
                <MenuItem key={ext.value} value={ext.value}>
                  {ext.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Phone Number"
            name="phone"
            value={editUser?.phone || ""}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="First Line of Address"
            name="address"
            value={editUser?.address || ""}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Employment Status"
            name="employmentStatus"
            value={editUser?.employmentStatus || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          {editUser?.employmentStatus === "Employed" && (
            <TextField
              label="Monthly Salary (RM)"
              name="monthlySalary"
              type="number"
              value={editUser?.monthlySalary || ""}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              helperText="Only numeric values are allowed"
            />
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {(error || success) && (
          <Alert
            onClose={() => setToastOpen(false)}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || success}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
