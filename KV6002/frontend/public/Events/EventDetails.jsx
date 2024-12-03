import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import BookingForm from "./BookingForm"; // Import BookingForm

const EventDetails = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false); // Toggle for booking form
  const [currentCapacity, setCurrentCapacity] = useState(0); // Track current bookings

  // Fetch event details from Firestore
  const fetchEventDetails = async () => {
    try {
      const eventDoc = doc(db, "Events", id);
      const eventSnapshot = await getDoc(eventDoc);

      if (eventSnapshot.exists()) {
        setEvent({ id: eventSnapshot.id, ...eventSnapshot.data() });
        fetchCurrentCapacity(eventSnapshot.id); // Fetch current bookings
      } else {
        console.error("Event not found");
        setEvent(null);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
      console.log("Event details loaded: ", event);
    }
  };

  // Fetch current bookings for the event
  const fetchCurrentCapacity = async (eventId) => {
    try {
      const bookingsQuery = query(
        collection(db, "Bookings"),
        where("eventId", "==", eventId),
        where("status", "==", "Booked")
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      setCurrentCapacity(bookingsSnapshot.docs.length); // Update capacity
    } catch (error) {
      console.error("Error fetching event capacity:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography
          variant="body1"
          sx={{ mt: 2 }}
        >
          Loading event details...
        </Typography>
      </Box>
    );
  }

  if (!event) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Event details not found.
      </Typography>
    );
  }

  const spacesLeft = Math.max(event.Capacity - currentCapacity, 0);
  const isFullyBooked = spacesLeft === 0;

  return (
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: "#f8e8e8", // Light pink for the overall page
        minHeight: "100vh",
      }}
    >
      {!showBookingForm ? (
        <Grid
          container
          spacing={4}
          justifyContent="center"
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Card
              sx={{
                boxShadow: 3,
                backgroundColor: "#ffffff", // White background for event details card
                padding: "2rem",
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#7B3F3F",
                    textAlign: "center",
                    mb: 3,
                    fontWeight: "bold",
                  }}
                >
                  {event.Title}
                </Typography>

                <Typography sx={{ mb: 2, color: "#555" }}>
                  <strong>Date:</strong>{" "}
                  {new Date(event.Date).toLocaleDateString()}
                </Typography>
                <Typography sx={{ mb: 2, color: "#555" }}>
                  <strong>Location:</strong> {event.Location}
                </Typography>
                <Typography sx={{ mb: 2, color: "#555" }}>
                  <strong>Spaces Left:</strong>{" "}
                  {isFullyBooked
                    ? "No spaces left"
                    : `${spacesLeft} spaces available`}
                </Typography>
                <Typography sx={{ mb: 3, color: "#555" }}>
                  <strong>Description:</strong> {event.Description}
                </Typography>

                <Box
                  component="img"
                  src={event.imageURL || "/placeholder.png"}
                  alt={event.Title}
                  sx={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "cover",
                    borderRadius: "8px",
                    mb: 3,
                  }}
                />

                <Button
                  variant="contained"
                  color={isFullyBooked ? "secondary" : "primary"}
                  fullWidth
                  onClick={() => !isFullyBooked && setShowBookingForm(true)} // Show booking form if not fully booked
                  disabled={isFullyBooked} // Disable if fully booked
                >
                  {isFullyBooked ? "Fully Booked" : "Book / RSVP"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <BookingForm
          event={event} // Pass event details as props
          onCancel={() => setShowBookingForm(false)} // Handle cancel action
        />
      )}
    </Box>
  );
};

export default EventDetails;
