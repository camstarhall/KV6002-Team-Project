import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const BookingForm = ({ event, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    employmentStatus: "",
    annualSalary: "",
  });
  const [currentCapacity, setCurrentCapacity] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch current booking capacity
  const fetchCurrentCapacity = async () => {
    try {
      const bookingsQuery = query(
        collection(db, "Bookings"),
        where("eventId", "==", event.id),
        where("status", "==", "Booked")
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      setCurrentCapacity(bookingsSnapshot.docs.length);
    } catch (error) {
      console.error("Error fetching current capacity:", error);
    }
  };

  useEffect(() => {
    fetchCurrentCapacity();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate current capacity
    if (currentCapacity >= event.Capacity) {
      setError("This event is fully booked.");
      return;
    }

    // Validation
    const age = calculateAge(formData.dateOfBirth);
    if (formData.gender !== "Female") {
      setError("Only females are allowed to book.");
      return;
    }
    if (age < 30 || age > 65) {
      setError("Only individuals aged between 30 and 65 can book.");
      return;
    }
    if (
      formData.employmentStatus === "Employed" &&
      parseFloat(formData.annualSalary) >= 1200
    ) {
      setError(
        "Booking is only available for unemployed or low-income individuals."
      );
      return;
    }

    try {
      // Add user details to Users collection
      const usersCollection = collection(db, "Users");
      const userRef = await addDoc(usersCollection, {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        employmentStatus: formData.employmentStatus,
        annualSalary: formData.annualSalary,
      });

      // Add booking details to Bookings collection
      const bookingsCollection = collection(db, "Bookings");
      await addDoc(bookingsCollection, {
        eventId: event.id,
        eventTitle: event.Title,
        userId: userRef.id, // Reference to the user's document ID
        status: "Booked",
        bookingDate: new Date().toISOString(),
      });

      // Update current capacity
      await fetchCurrentCapacity();

      setSuccess("Booking successful!");
      setError("");
      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        address: "",
        employmentStatus: "",
        annualSalary: "",
      });
    } catch (err) {
      console.error("Error saving booking:", err);
      setError("An error occurred while processing your booking.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: 3,
        maxWidth: "500px",
        margin: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#7B3F3F" }}>
        Book / RSVP for {event.Title}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        select
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </TextField>
      <TextField
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleInputChange}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Home Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        select
        label="Employment Status"
        name="employmentStatus"
        value={formData.employmentStatus}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      >
        <MenuItem value="Employed">Employed</MenuItem>
        <MenuItem value="Unemployed">Unemployed</MenuItem>
      </TextField>
      {formData.employmentStatus === "Employed" && (
        <TextField
          label="Annual Salary"
          name="annualSalary"
          type="number"
          value={formData.annualSalary}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
      )}

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        <Button onClick={onCancel} variant="outlined" color="secondary">
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default BookingForm;
