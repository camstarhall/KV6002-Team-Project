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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from Firestore
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

  // Open modal for editing a user
  const handleEdit = (user) => {
    setEditUser(user);
    setModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setEditUser(null);
    setModalOpen(false);
  };

  // Handle form submission for updating user details
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (editUser) {
      try {
        const userDoc = doc(db, "Users", editUser.id);
        await updateDoc(userDoc, editUser);
        fetchUsers(); // Refresh user list
        handleCloseModal();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  // Open confirmation dialog for deletion
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDialogOpen(true);
  };

  // Close confirmation dialog
  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
    setDialogOpen(false);
  };

  // Delete a user
  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteDoc(doc(db, "Users", userToDelete.id));
        fetchUsers(); // Refresh user list
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  return (
    <Box sx={{ backgroundColor: "#f8e8e8", padding: "2rem", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>
        Manage Users
      </Typography>

      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
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
              primary={
                <Typography sx={{ color: "#7B3F3F", fontWeight: "bold" }}>
                  {user.fullName}
                </Typography>
              }
              secondary={
                <>
                  <Typography sx={{ color: "black" }}>Email: {user.email}</Typography>
                  <Typography sx={{ color: "black" }}>Phone: {user.phone}</Typography>
                  <Typography sx={{ color: "black" }}>Gender: {user.gender}</Typography>
                  <Typography sx={{ color: "black" }}>
                    Date of Birth: {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                  <Typography sx={{ color: "black" }}>Address: {user.address}</Typography>
                  <Typography sx={{ color: "black" }}>
                    Employment Status: {user.employmentStatus}
                  </Typography>
                  {user.employmentStatus === "Employed" && (
                    <Typography sx={{ color: "black" }}>
                      Annual Salary: {user.annualSalary}
                    </Typography>
                  )}
                </>
              }
            />
            <IconButton color="primary" onClick={() => handleEdit(user)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleOpenDeleteDialog(user)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

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
          />
          <TextField
            label="Phone"
            name="phone"
            value={editUser?.phone || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
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
              label="Annual Salary"
              name="annualSalary"
              value={editUser?.annualSalary || ""}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
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

      {/* Delete Confirmation Dialog */}
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
