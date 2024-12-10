// KV6002/frontend/public/Events/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import BookingForm from "./BookingForm";

const EventDetails = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentCapacity, setCurrentCapacity] = useState(0);

  const fetchEventDetails = async () => {
    try {
      const eventDoc = doc(db, "Events", id);
      const eventSnapshot = await getDoc(eventDoc);

      if (eventSnapshot.exists()) {
        setEvent({ id: eventSnapshot.id, ...eventSnapshot.data() });
        fetchCurrentCapacity(eventSnapshot.id);
      } else {
        console.error("Event not found");
        setEvent(null);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentCapacity = async (eventId) => {
    try {
      const bookingsQuery = query(
        collection(db, "Bookings"),
        where("eventId", "==", eventId),
        where("status", "==", "Booked")
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      setCurrentCapacity(bookingsSnapshot.docs.length);
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
        <Typography variant="body1" sx={{ mt: 2 }}>
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
        backgroundColor: "#f8e8e8",
        minHeight: "100vh",
      }}
    >
      {/* Back to Events Button */}
      <Box sx={{ mb: 2 }}>
        <Link to="/events" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="primary">
            Back to Events
          </Button>
        </Link>
      </Box>

      {!showBookingForm ? (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                boxShadow: 3,
                backgroundColor: "#ffffff",
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
                  {isFullyBooked ? "No spaces left" : `${spacesLeft} spaces available`}
                </Typography>
                <Typography sx={{ mb: 3, color: "#555" }}>
                  <strong>Description:</strong> {event.Description}
                </Typography>

                <Button
                  variant="contained"
                  color={isFullyBooked ? "secondary" : "primary"}
                  fullWidth
                  onClick={() => !isFullyBooked && setShowBookingForm(true)}
                  disabled={isFullyBooked}
                >
                  {isFullyBooked ? "Fully Booked" : "Book / RSVP"}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={event.imageURL || "/placeholder.png"}
              alt={event.Title}
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Grid>
        </Grid>
      ) : (
        <BookingForm
          event={event}
          onCancel={() => setShowBookingForm(false)}
        />
      )}
    </Box>
  );
};

export default EventDetails;
