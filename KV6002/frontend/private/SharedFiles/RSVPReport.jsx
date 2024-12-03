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
  MenuItem,
  Select,
  FormControl,
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
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalCancellations, setTotalCancellations] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "Events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents([{ id: "All", Title: "All Events" }, ...eventsData]);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(db, "Bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);

      const bookingsData = bookingsSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (!data.eventId || !data.userId) {
            console.warn(`Booking ${doc.id} is missing eventId or userId.`);
            return null; // Skip invalid bookings
          }
          return { id: doc.id, ...data };
        })
        .filter(Boolean); // Remove null values

      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          const eventDoc = await getDoc(doc(db, "Events", booking.eventId));
          const eventData = eventDoc.exists() ? eventDoc.data() : {};

          const userDoc = await getDoc(doc(db, "Users", booking.userId));
          const userData = userDoc.exists() ? userDoc.data() : {};

          return {
            ...booking,
            bookingId: booking.id,
            eventTitle: eventData.Title || "N/A",
            eventDate: eventData.Date || "N/A",
            eventLocation: eventData.Location || "N/A",
            userName: userData.fullName || "N/A",
            userDateOfBirth: userData.dateOfBirth || "N/A",
            userPhone: userData.phone || "N/A",
          };
        })
      );

      setBookings(enrichedBookings);
      setFilteredBookings(enrichedBookings);
      updateCounters(enrichedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCounters = (filteredData) => {
    const totalBookedOrAttended = filteredData.filter(
      (b) => b.status === "Booked" || b.status === "Attended"
    ).length;

    const totalCancelled = filteredData.filter(
      (b) => b.status === "Cancelled"
    ).length;

    const totalAttended = filteredData.filter(
      (b) => b.status === "Attended"
    ).length;

    setTotalBookings(totalBookedOrAttended);
    setTotalCancellations(totalCancelled);
    setTotalAttendees(totalAttended);
  };

  const handleEventChange = (event) => {
    const selectedEventId = event.target.value;
    setSelectedEvent(selectedEventId);

    if (selectedEventId === "All") {
      setFilteredBookings(bookings);
      updateCounters(bookings);
    } else {
      const filteredData = bookings.filter(
        (booking) => booking.eventId === selectedEventId
      );
      setFilteredBookings(filteredData);
      updateCounters(filteredData);
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
      const bookingDoc = doc(db, "Bookings", selectedBooking.id);
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
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: "bold",
            padding: "1rem",
            backgroundColor: "#7B3F3F",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          Total Bookings: {totalBookings}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: "bold",
            padding: "1rem",
            backgroundColor: "#E57373",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          Total Cancellations: {totalCancellations}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: "bold",
            padding: "1rem",
            backgroundColor: "#388E3C",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          Total Attendees: {totalAttendees}
        </Typography>
        <FormControl>
          <Select
            value={selectedEvent}
            onChange={handleEventChange}
            sx={{ backgroundColor: "white", borderRadius: "4px" }}
          >
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.Title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              <TableCell><strong>Phone Number</strong></TableCell>
              <TableCell><strong>Date of Birth</strong></TableCell>
              <TableCell><strong>Booking Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.bookingId}>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.eventTitle}</TableCell>
                <TableCell>{booking.eventDate}</TableCell>
                <TableCell>{booking.eventLocation}</TableCell>
                <TableCell>{booking.userName}</TableCell>
                <TableCell>{booking.userPhone}</TableCell>
                <TableCell>{new Date(booking.userDateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  {booking.status === "Booked" && (
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
