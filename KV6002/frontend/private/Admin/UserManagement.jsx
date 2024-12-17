import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
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
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const phoneExtensions = [
  { label: "Malaysia (+60)", value: "60" },
  { label: "UK (+44)", value: "44" },
  { label: "USA (+1)", value: "1" },
  { label: "India (+91)", value: "91" },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "Users");
      const userDocs = await getDocs(usersCollection);
      const userData = userDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userData);
    } catch (error) {
      setError("Failed to fetch users.");
      setToastOpen(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser({
      ...user,
      phoneExtension: user.phone?.slice(0, 2),
      phone: user.phone?.slice(2),
    });
    setModalOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const userDoc = doc(db, "Users", userToDelete.id);
      await deleteDoc(userDoc);
      setSuccess("User deleted successfully!");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch {
      setError("Failed to delete user.");
      setToastOpen(true);
    }
  };

  const handleCloseModal = () => {
    setEditUser(null);
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setToastOpen(false);

    const fullPhoneNumber = editUser.phoneExtension + editUser.phone;
    const updatedUser = { ...editUser, phone: fullPhoneNumber };

    try {
      const userDoc = doc(db, "Users", updatedUser.id);
      await updateDoc(userDoc, updatedUser);
      setSuccess("User updated successfully!");
      fetchUsers();
      handleCloseModal();
    } catch {
      setError("Failed to update user.");
      setToastOpen(true);
    }
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>
        Manage Users
      </Typography>

      {/* Users Table */}
      <TableContainer component={Paper}>
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
                <TableCell>{user.fullName || "N/A"}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>{user.gender || "N/A"}</TableCell>
                <TableCell>{user.dateOfBirth || "N/A"}</TableCell>
                <TableCell>{user.address || "N/A"}</TableCell>
                <TableCell>{user.employmentStatus || "N/A"}</TableCell>
                <TableCell>{user.monthlySalary || "N/A"}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
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
          <Typography variant="h6" sx={{ mb: 2 }}>Edit User</Typography>
          <TextField label="Full Name" name="fullName" value={editUser?.fullName || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Email" name="email" value={editUser?.email || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <FormControl fullWidth required>
                <InputLabel>Ext.</InputLabel>
                <Select name="phoneExtension" value={editUser?.phoneExtension || ""} onChange={handleInputChange}>
                  {phoneExtensions.map((ext) => (
                    <MenuItem key={ext.value} value={ext.value}>{ext.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <TextField label="Phone Number" name="phone" value={editUser?.phone || ""} onChange={handleInputChange} fullWidth required />
            </Grid>
          </Grid>
          {editUser?.employmentStatus && editUser?.employmentStatus !== "N/A" && (
            <>
              <TextField label="Gender" name="gender" value={editUser?.gender || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              <TextField label="Date of Birth" name="dateOfBirth" type="date" value={editUser?.dateOfBirth || ""} onChange={handleInputChange} fullWidth InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
              <TextField label="Address" name="address" value={editUser?.address || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Employment Status</InputLabel>
                <Select name="employmentStatus" value={editUser?.employmentStatus || ""} onChange={handleInputChange}>
                  <MenuItem value="Employed">Employed</MenuItem>
                  <MenuItem value="Unemployed">Unemployed</MenuItem>
                </Select>
              </FormControl>
              {editUser?.employmentStatus === "Employed" && (
                <TextField label="Monthly Salary" name="monthlySalary" value={editUser?.monthlySalary || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              )}
            </>
          )}
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>Save</Button>
          <Button onClick={handleCloseModal} variant="outlined" color="secondary">Cancel</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserManagement;
