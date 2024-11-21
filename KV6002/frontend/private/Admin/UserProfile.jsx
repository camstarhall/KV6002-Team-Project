import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    country: "United States",
    sex: "Male",
    employment: "Employed",
    salary: "$50,000",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const handleSave = () => {
    // Save the updated details (in a real-world app, send them to the backend)
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#D08C8C", minHeight: "80vh" }}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: 2,
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ color: "#7B3F3F", marginBottom: "1rem" }}>
          User Profile
        </Typography>

        {/* Profile Details */}
        <Box sx={{ marginBottom: "1rem" }}>
          <TextField
            label="Full Name"
            name="fullName"
            value={userDetails.fullName}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: isEditing ? "#F9F9F9" : "#EAEAEA" }}
          />
          <TextField
            label="Email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: isEditing ? "#F9F9F9" : "#EAEAEA" }}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: isEditing ? "#F9F9F9" : "#EAEAEA" }}
          />
          <TextField
            label="Country"
            name="country"
            value={userDetails.country}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: isEditing ? "#F9F9F9" : "#EAEAEA" }}
          />
          <TextField
            label="Sex"
            name="sex"
            value={userDetails.sex}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: isEditing ? "#F9F9F9" : "#EAEAEA" }}
          />
          <TextField
            label="Employment Status"
            name="employment"
            value={userDetails.employment}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: isEditing ? "#F9F9F9" : "#EAEAEA" }}
          />
          <TextField
            label="Salary"
            name="salary"
            value={userDetails.salary}
            onChange={handleInputChange}
            InputProps={{ readOnly: !isEditing }}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: isEditing ? "#F9F9F9" : "#EAEAEA" }}
          />
        </Box>

        {/* Edit/Save Buttons */}
        {isEditing ? (
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ backgroundColor: "#7B3F3F" }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={toggleEditMode}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <IconButton color="primary" onClick={toggleEditMode}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;
