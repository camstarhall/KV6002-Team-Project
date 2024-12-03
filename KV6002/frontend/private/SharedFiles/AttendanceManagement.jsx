import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const AttendanceManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [searchType, setSearchType] = useState("bookingId");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsCollection = collection(db, "Bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);

      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        bookingId: doc.id,
        ...doc.data(),
      }));

      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          const eventDoc = booking.eventId
            ? await getDoc(doc(db, "Events", booking.eventId))
            : null;
          const eventData = eventDoc?.exists() ? eventDoc.data() : {};

          const userDoc = booking.userId
            ? await getDoc(doc(db, "Users", booking.userId))
            : null;
          const userData = userDoc?.exists() ? userDoc.data() : {};

          return {
            ...booking,
            eventTitle: eventData?.Title || "N/A",
            eventDate: eventData?.Date
              ? new Date(eventData.Date).toLocaleDateString()
              : "N/A",
            eventLocation: eventData?.Location || "N/A",
            userName: userData?.fullName || "N/A",
            userPhone: userData?.phone || "N/A",
            userDateOfBirth: userData?.dateOfBirth
              ? new Date(userData.dateOfBirth).toLocaleDateString()
              : "N/A",
          };
        })
      );

      setBookings(enrichedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchExecuted(true);

    if (!searchQuery.trim()) {
      setFilteredBookings([]);
      return;
    }

    const query = searchQuery.trim().toLowerCase();

    const matchedBookings = bookings.filter((booking) => {
      switch (searchType) {
        case "bookingId":
          return booking.bookingId?.toLowerCase() === query;
        case "phone":
          return booking.userPhone?.toLowerCase() === query;
        case "dateOfBirth":
          return booking.userDateOfBirth === query;
        case "name":
          return booking.userName?.toLowerCase().includes(query);
        default:
          return false;
      }
    });

    setFilteredBookings(matchedBookings);
  };

  const markAsAttended = async (bookingId) => {
    try {
      const bookingDoc = doc(db, "Bookings", bookingId);
      await updateDoc(bookingDoc, { status: "Attended" });
      fetchBookings();
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body1">Loading Attendance Management...</Typography>
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
        Attendance Management
      </Typography>

      {/* Search Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Search By</InputLabel>
          <Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <MenuItem value="bookingId">Booking ID</MenuItem>
            <MenuItem value="phone">Phone Number</MenuItem>
            <MenuItem value="dateOfBirth">Date of Birth</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={`Enter ${
            searchType === "dateOfBirth" ? "DOB (yyyy-MM-dd)" : searchType
          }`}
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type={searchType === "dateOfBirth" ? "date" : "text"}
          InputLabelProps={searchType === "dateOfBirth" ? { shrink: true } : {}}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#7B3F3F", color: "white" }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      {/* Search Results */}
      {filteredBookings.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Booking ID</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Event Title</strong></TableCell>
                <TableCell><strong>Event Date</strong></TableCell>
                <TableCell><strong>Event Location</strong></TableCell>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Date of Birth</strong></TableCell>
                <TableCell><strong>Phone Number</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.bookingId || "N/A"}</TableCell>
                  <TableCell>{booking.status || "N/A"}</TableCell>
                  <TableCell>{booking.eventTitle || "N/A"}</TableCell>
                  <TableCell>{booking.eventDate || "N/A"}</TableCell>
                  <TableCell>{booking.eventLocation || "N/A"}</TableCell>
                  <TableCell>{booking.userName || "N/A"}</TableCell>
                  <TableCell>{booking.userDateOfBirth || "N/A"}</TableCell>
                  <TableCell>{booking.userPhone || "N/A"}</TableCell>
                  <TableCell>
                    {booking.status === "Booked" && (
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#4caf50", color: "white" }}
                        onClick={() => markAsAttended(booking.bookingId)}
                      >
                        Mark as Attended
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Results */}
      {searchExecuted && filteredBookings.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center", color: "#7B3F3F" }}>
          No matching bookings found. Check your search criteria.
        </Typography>
      )}
    </Box>
  );
};

export default AttendanceManagement;
