import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Select,
  InputAdornment,
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
    monthlySalary: "",
    phoneExtension: "+60", // Default extension (Malaysia)
  });
  const [currentCapacity, setCurrentCapacity] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Phone number extensions
  const phoneExtensions = [
    { label: "Malaysia (+60)", value: "60" },
    { label: "UK (+44)", value: "44" },
    { label: "USA (+1)", value: "1" },
    { label: "India (+91)", value: "91" },
  ];

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

  const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name.trim());
  const isValidPhone = (phone) => /^[0-9]{7,15}$/.test(phone.trim());
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidAddress = (address) => address.trim().length >= 5;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    // Validate fields
    if (!isValidName(formData.fullName)) {
      setError("Please enter a valid name (letters and spaces only).");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (formData.email && !isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidAddress(formData.address)) {
      setError("Please enter a valid home address (at least 5 characters).");
      return;
    }
    if (formData.gender !== "Female") {
      setError("Only females are allowed to book this event.");
      return;
    }
    if (
      formData.employmentStatus === "Employed" &&
      parseFloat(formData.monthlySalary) >= 1500
    ) {
      setError(
        "Your monthly salary must be less than RM 1500 to qualify for booking."
      );
      return;
    }

    // Validate current capacity
    if (currentCapacity >= event.Capacity) {
      setError("This event is fully booked.");
      return;
    }

    const fullPhoneNumber = formData.phoneExtension + formData.phone;

    try {
      const usersCollection = collection(db, "Users");
      const bookingsCollection = collection(db, "Bookings");

      // Check if the phone number is already used for an existing user
      const existingUserQuery = query(
        usersCollection,
        where("phone", "==", fullPhoneNumber)
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
          phone: fullPhoneNumber,
          address: formData.address,
          employmentStatus: formData.employmentStatus,
          monthlySalary: formData.monthlySalary || null,
        });
        userId = userDoc.id; // Get the new user ID
      } else {
        // Get the existing user ID
        userId = existingUserSnapshot.docs[0].id;
      }

      // Check if the user has already booked this event
      const existingBookingQuery = query(
        bookingsCollection,
        where("eventId", "==", event.id),
        where("phone", "==", fullPhoneNumber)
      );
      const existingBookingSnapshot = await getDocs(existingBookingQuery);

      if (!existingBookingSnapshot.empty) {
        const existingBooking = existingBookingSnapshot.docs[0].data();
        if (existingBooking.status === "Booked") {
          setError("You've already booked this event.");
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

      // Save new booking to the Bookings collection
      await addDoc(bookingsCollection, {
        eventId: event.id,
        eventTitle: event.Title,
        phone: fullPhoneNumber,
        email: formData.email || null,
        status: "Booked",
        bookingDate: new Date().toISOString(),
        userId: userId,
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
        monthlySalary: "",
        phoneExtension: "+60",
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
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "#7B3F3F" }}
      >
        Book / RSVP for {event.Title}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}

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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Select
                name="phoneExtension"
                value={formData.phoneExtension}
                onChange={handleInputChange}
                sx={{ mr: 1 }}
              >
                {phoneExtensions.map((ext) => (
                  <MenuItem
                    key={ext.value}
                    value={ext.value}
                  >
                    {ext.label}
                  </MenuItem>
                ))}
              </Select>
            </InputAdornment>
          ),
        }}
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
          label="Monthly Salary (RM)"
          name="monthlySalary"
          type="number"
          value={formData.monthlySalary}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
      )}

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default BookingForm;
