// src/components/EventDetails.jsx

import React, { useState } from "react";
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const EventDetails = () => {
  const location = useLocation();
  const { event } = location.state;
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  // Retrieve the logged-in user details
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // Handle booking confirmation
  const handleBookEvent = () => {
    if (!user) {
      alert("Please log in to book an event.");
      navigate("/login"); // Redirect to login page if not logged in
      return;
    }
    setOpen(true); // Open the confirmation dialog if logged in
  };

  const confirmBooking = () => {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const bookingDetails = {
      bookingId: uuidv4(), // Unique booking ID
      eventId: event.id,
      eventName: event.title,
      userName: user.fullName,
      userEmail: user.email,
      userPhone: user.phoneNumber,
      status: "Booked",
    };

    bookings.push(bookingDetails);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    setOpen(false);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 2 }}>{event.title}</Typography>
      <Typography>Date: {event.date}</Typography>
      <Typography>Location: {event.location}</Typography>
      <Typography>Capacity: {event.capacity}</Typography>
      <Typography>Description: {event.description}</Typography>

      <Button variant="contained" color="primary" onClick={handleBookEvent} sx={{ mt: 3 }}>
        Book Event
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to book this event?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={confirmBooking} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Booking confirmed!"
      />
    </Box>
  );
};

export default EventDetails;
