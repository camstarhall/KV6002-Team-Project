// src/components/RSVPReport.jsx

import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

const RSVPReport = () => {
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalCancellations, setTotalCancellations] = useState(0);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
    updateCounts(storedBookings);
  }, []);

  const updateCounts = (currentBookings) => {
    const booked = currentBookings.filter((booking) => booking.status === "Booked").length;
    const cancelled = currentBookings.filter((booking) => booking.status === "Cancelled").length;
    setTotalBookings(booked);
    setTotalCancellations(cancelled);
  };

  const handleCancelBooking = (index) => {
    const updatedBookings = bookings.map((booking, i) => 
      i === index ? { ...booking, status: "Cancelled" } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    updateCounts(updatedBookings);
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 3 }}>RSVP Report</Typography>
      <Typography>Total Bookings: {totalBookings}</Typography>
      <Typography>Total Cancellations: {totalCancellations}</Typography>

      {bookings.map((booking, index) => (
        <Card key={index} sx={{ mb: 2, boxShadow: 2, backgroundColor: "#ffffff" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#7B3F3F" }}>{booking.eventName}</Typography>
            <Typography>Name: {booking.userName}</Typography>
            <Typography>Email: {booking.userEmail}</Typography>
            <Typography>Phone: {booking.userPhone}</Typography>
            <Typography>Status: {booking.status}</Typography>
            {booking.status === "Booked" && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancelBooking(index)}
                sx={{ mt: 1 }}
              >
                Cancel Booking
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default RSVPReport;
