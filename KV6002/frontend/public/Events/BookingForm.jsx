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

    // Reset messages
    setError("");
    setSuccess("");

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
      // Check if the user already has a booking for this event
      const bookingsCollection = collection(db, "Bookings");
      const existingBookingQuery = query(
        bookingsCollection,
        where("eventId", "==", event.id),
        where("phone", "==", formData.phone)
      );
      const existingBookingSnapshot = await getDocs(existingBookingQuery);

      if (!existingBookingSnapshot.empty) {
        const existingBooking = existingBookingSnapshot.docs[0].data();
        if (existingBooking.status === "Booked") {
          setError("You have already booked this event.");
          return;
        } else if (existingBooking.status === "Cancelled") {
          // Allow rebooking if the booking was previously cancelled
          const bookingDocId = existingBookingSnapshot.docs[0].id;
          const bookingDoc = doc(db, "Bookings", bookingDocId);

          await updateDoc(bookingDoc, {
            status: "Booked",
            bookingDate: new Date().toISOString(),
          });

          setSuccess("Your booking has been successfully reactivated!");
          fetchCurrentCapacity();
          return;
        }
      }

      // Save user details to the Users collection
      const usersCollection = collection(db, "Users");
      const existingUserQuery = query(
        usersCollection,
        where("phone", "==", formData.phone)
      );
      const existingUserSnapshot = await getDocs(existingUserQuery);

      let userId;

      if (existingUserSnapshot.empty) {
        // Create a new user record
        const userDoc = await addDoc(usersCollection, {
          fullName: formData.fullName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email || null,
          phone: formData.phone,
          address: formData.address,
          employmentStatus: formData.employmentStatus,
          annualSalary: formData.annualSalary || null,
        });
        userId = userDoc.id; // Get the new user ID
      } else {
        // Get the existing user ID
        userId = existingUserSnapshot.docs[0].id;
      }

      // Save new booking to the Bookings collection
      await addDoc(bookingsCollection, {
        eventId: event.id,
        eventTitle: event.Title,
        userId: userId,
        phone: formData.phone,
        email: formData.email || null,
        status: "Booked",
        bookingDate: new Date().toISOString(),
      });

      setSuccess("Booking successful!");
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
      fetchCurrentCapacity();
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
        label="Email Address (Optional)"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        fullWidth
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
