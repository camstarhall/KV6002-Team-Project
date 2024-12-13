import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
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
    phoneExtension: "60", // Default extension (Malaysia) changed from "+60" to "60"
  });
  const [currentCapacity, setCurrentCapacity] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  // Phone number extensions
  const phoneExtensions = [
    { label: "Malaysia (+60)", value: "60" },
    { label: "UK (+44)", value: "44" },
    { label: "USA (+1)", value: "1" },
    { label: "India (+91)", value: "91" },
  ];

  // Validation functions
  const isValidName = (name) => /^[A-Za-z\s]+$/.test(name.trim());
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidAddress = (address) => address.trim().length >= 5;

  const getMaxPhoneLength = (extension) => {
    // Adjust these limits as needed
    switch (extension) {
      case "60": // Malaysia
        return 15;
      case "44": // UK
        return 13;
      case "1": // USA
        return 11;
      case "91": // India
        return 13;
      default:
        return 15;
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    // Validate fields
    if (!isValidName(formData.fullName)) {
      setError("Please enter a valid name (letters and spaces only).");
      setToastOpen(true);
      return;
    }
    if (!formData.phone.trim()) {
      setError("A phone number is required to send your booking confirmation.");
      setToastOpen(true);
      return;
    }
    if (!isValidPhone(formData.phone, formData.phoneExtension)) {
      setError("Please enter a valid phone number.");
      setToastOpen(true);
      return;
    }
    if (formData.email && !isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      setToastOpen(true);
      return;
    }
    if (!isValidAddress(formData.address)) {
      setError(
        "Please enter a valid first line of address (at least 5 characters)."
      );
      setToastOpen(true);
      return;
    }
    if (
      event.isRestricted &&
      formData.employmentStatus === "Employed" &&
      parseFloat(formData.monthlySalary) >= 5250
    ) {
      setError(
        "Your monthly household income must be less than RM 5250 to qualify for booking."
      );
      setToastOpen(true);
      return;
    }

    // Validate current capacity
    if (currentCapacity >= event.Capacity) {
      setError("This event is fully booked.");
      setToastOpen(true);
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
          gender: event.isRestricted ? formData.gender : null,
          dateOfBirth: event.isRestricted ? formData.dateOfBirth : null,
          email: formData.email || null,
          phone: fullPhoneNumber,
          address: formData.address,
          employmentStatus: event.isRestricted
            ? formData.employmentStatus
            : null,
          monthlySalary: event.isRestricted ? formData.monthlySalary : null,
        });
        userId = userDoc.id; // Get the new user ID
      } else {
        // Get the existing user ID
        userId = existingUserSnapshot.docs[0].id;
      }

      // Check if a booking already exists for the same event and phone number and is still active
      const existingBookingQuery = query(
        bookingsCollection,
        where("eventId", "==", event.id),
        where("phone", "==", fullPhoneNumber),
        where("status", "==", "Booked")
      );
      const existingBookingSnapshot = await getDocs(existingBookingQuery);

      if (!existingBookingSnapshot.empty) {
        setError(
          "You have already booked this event. Only one active booking is allowed per event."
        );
        setToastOpen(true);
        return;
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
        eventDate: event.Date,
        uniqueCode: event.uniqueCode, // Use the event's unique code
      });

      setSuccess("Booking successful!");
      setToastOpen(true);
      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        address: "",
        employmentStatus: "",
        monthlySalary: "",
        phoneExtension: "60",
      });
      fetchCurrentCapacity();
    } catch (err) {
      console.error("Error saving booking:", err);
      setError("An error occurred while processing your booking.");
      setToastOpen(true);
    }
  };

  const isValidPhone = (phone, extension) => {
    const extensionLength = extension.length;
    const maxLen = getMaxPhoneLength(extension);
    return /^[0-9]+$/.test(phone) && phone.length + extensionLength <= maxLen;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check phone length dynamically based on selected extension
    if (name === "phone") {
      const extensionLength = formData.phoneExtension.length;
      const maxLen = getMaxPhoneLength(formData.phoneExtension);
      if (value.length + extensionLength > maxLen) {
        setError(
          `Phone number exceeds the maximum allowed length for this extension.`
        );
        setToastOpen(true);
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
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

      <TextField
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      {event.isRestricted && (
        <>
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
        </>
      )}

      <TextField
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Grid
        container
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Grid
          item
          xs={4}
        >
          <TextField
            select
            label="Ext."
            name="phoneExtension"
            value={formData.phoneExtension}
            onChange={handleInputChange}
            fullWidth
          >
            {phoneExtensions.map((ext) => (
              <MenuItem
                key={ext.value}
                value={ext.value}
              >
                {ext.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          xs={8}
        >
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
      </Grid>
      <TextField
        label="First Line of Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      {event.isRestricted && (
        <>
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
              label="Monthly Household Income (RM)"
              name="monthlySalary"
              type="number"
              value={formData.monthlySalary}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          )}
        </>
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

      {/* Toast notifications */}
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

export default BookingForm;
