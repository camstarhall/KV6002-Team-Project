import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState("Ascending");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    sortUsers();
  }, [users, sortOrder]);

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

  const sortUsers = () => {
    const sortedUsers = [...users];
    if (sortOrder === "Ascending") {
      sortedUsers.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
    } else {
      sortedUsers.sort((a, b) => (b.fullName || "").localeCompare(a.fullName || ""));
    }
    setUsers(sortedUsers);
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

    // Required fields validation
    const requiredFields = ["fullName", "phone", "gender", "dateOfBirth", "address", "employmentStatus"];
    for (let field of requiredFields) {
      if (!editUser?.[field]?.trim()) {
        alert(`The field "${field}" cannot be empty.`);
        return;
      }
    }

    // Email validation (optional but must be valid if provided)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editUser.email && !emailRegex.test(editUser.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Phone validation (must include a valid country code and length)
    const phoneRegex = /^\+(60\d{9}|44\d{10}|1\d{10}|91\d{10})$/; // Malaysia (+60), UK (+44), US (+1), India (+91)
    if (!phoneRegex.test(editUser.phone)) {
      alert(
        "Please enter a valid phone number with the correct country code (e.g., +60, +44, +1, +91) followed by the correct number of digits."
      );
      return;
    }

    // Ensure phone number is unique
    const isDuplicatePhone = users.some(
      (user) => user.phone === editUser.phone && user.id !== editUser.id
    );
    if (isDuplicatePhone) {
      alert("Phone number already exists. Please use a unique phone number.");
      return;
    }

    // Salary validation (must be a numeric value)
    if (editUser.employmentStatus === "Employed" && isNaN(editUser.monthlySalary)) {
      alert("Monthly Salary must be a numeric value.");
      return;
    }

    try {
      const userDoc = doc(db, "Users", editUser.id);
      await updateDoc(userDoc, editUser);
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
    setDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteDoc(doc(db, "Users", userToDelete.id));
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        handleCloseDeleteDialog();
      }
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

      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-order-label">Sort by Name</InputLabel>
          <Select
            labelId="sort-order-label"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="Ascending">Ascending</MenuItem>
            <MenuItem value="Descending">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Date of Birth</strong></TableCell>
              <TableCell><strong>Address</strong></TableCell>
              <TableCell><strong>Employment Status</strong></TableCell>
              <TableCell><strong>Monthly Salary</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>{user.gender || "N/A"}</TableCell>
                <TableCell>
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>{user.address || "N/A"}</TableCell>
                <TableCell>{user.employmentStatus || "N/A"}</TableCell>
                <TableCell>
                  {user.employmentStatus === "Employed"
                    ? `RM ${user.monthlySalary}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteDialog(user)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={editUser?.email || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            helperText="Optional, but must be valid if provided"
          />
          <TextField
            label="Phone"
            name="phone"
            value={editUser?.phone || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            helperText="Include a valid country code (e.g., +60, +44, +1, +91)"
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={editUser?.dateOfBirth || ""}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            value={editUser?.address || ""}
            onChange={handleInputChange}
            fullWidth
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
              value={editUser?.monthlySalary || ""}
              onChange={(e) => {
                if (!isNaN(e.target.value) || e.target.value === "") {
                  handleInputChange(e);
                }
              }}
              fullWidth
              sx={{ mb: 2 }}
              helperText="Only numeric values are allowed."
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

      <Dialog open={dialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user{" "}
            <strong>{userToDelete?.fullName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
