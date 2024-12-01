import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const RSVPReport = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalCancellations, setTotalCancellations] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0); // Count of Attendees
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(db, "Bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);

      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          const eventDoc = await getDoc(doc(db, "Events", booking.eventId));
          const eventData = eventDoc.exists() ? eventDoc.data() : {};

          const userDoc = await getDoc(doc(db, "Users", booking.userId));
          const userData = userDoc.exists() ? userDoc.data() : {};

          return {
            bookingId: booking.id,
            bookingStatus: booking.status || "N/A",
            bookingDate: booking.bookingDate || "N/A",
            eventTitle: eventData.Title || "N/A",
            eventDate: eventData.Date || "N/A",
            eventLocation: eventData.Location || "N/A",
            userName: userData.fullName || "N/A",
            userDateOfBirth: userData.dateOfBirth || "N/A",
          };
        })
      );

      setBookings(enrichedBookings);

      // Update counters
      const totalBookedOrAttended = enrichedBookings.filter(
        (b) => b.bookingStatus === "Booked" || b.bookingStatus === "Attended"
      ).length;

      const totalCancelled = enrichedBookings.filter(
        (b) => b.bookingStatus === "Cancelled"
      ).length;

      const totalAttended = enrichedBookings.filter(
        (b) => b.bookingStatus === "Attended"
      ).length;

      setTotalBookings(totalBookedOrAttended);
      setTotalCancellations(totalCancelled);
      setTotalAttendees(totalAttended);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCancelDialog = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      const bookingDoc = doc(db, "Bookings", selectedBooking.bookingId);
      await updateDoc(bookingDoc, { status: "Cancelled" });

      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      closeCancelDialog();
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading RSVP Report...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          color: "#7B3F3F",
          mb: 3,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        RSVP Report
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#7B3F3F",
            fontWeight: "bold",
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          Total Bookings: {totalBookings}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "#7B3F3F",
            fontWeight: "bold",
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          Total Cancellations: {totalCancellations}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "#7B3F3F",
            fontWeight: "bold",
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          Total Attendees: {totalAttendees}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Booking Number</strong></TableCell>
              <TableCell><strong>Event Title</strong></TableCell>
              <TableCell><strong>Event Date</strong></TableCell>
              <TableCell><strong>Event Location</strong></TableCell>
              <TableCell><strong>User Name</strong></TableCell>
              <TableCell><strong>Date of Birth</strong></TableCell>
              <TableCell><strong>Booking Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.bookingId}>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.eventTitle}</TableCell>
                <TableCell>{booking.eventDate}</TableCell>
                <TableCell>{booking.eventLocation}</TableCell>
                <TableCell>{booking.userName}</TableCell>
                <TableCell>{new Date(booking.userDateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                <TableCell>{booking.bookingStatus}</TableCell>
                <TableCell>
                  {booking.bookingStatus === "Booked" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => openCancelDialog(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={closeCancelDialog}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel the booking for "{selectedBooking?.eventTitle}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} color="primary">
            No
          </Button>
          <Button onClick={handleCancelBooking} color="error" autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RSVPReport;
