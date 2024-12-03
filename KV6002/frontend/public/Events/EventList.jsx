import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from Firestore
  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "Events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ color: "#7B3F3F", mb: 4, textAlign: "center" }}
      >
        Upcoming Events
      </Typography>
      {loading ? (
        <Typography sx={{ color: "#7B3F3F", textAlign: "center" }}>
          Loading events...
        </Typography>
      ) : events.length === 0 ? (
        <Typography sx={{ color: "#7B3F3F", textAlign: "center" }}>
          No events available
        </Typography>
      ) : (
        events.map((event) => (
          <Card
            key={event.id}
            sx={{
              display: "flex",
              mb: 2,
              backgroundColor: "#ffffff",
              boxShadow: 2,
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={event.imageURL || "/placeholder.png"}
              alt={event.Title}
            />
            <CardContent>
              <Typography
                variant="h5"
                sx={{ color: "#7B3F3F" }}
              >
                {event.Title}
              </Typography>
              <Typography>
                Date: {new Date(event.Date).toLocaleDateString()}
              </Typography>
              <Typography>Location: {event.Location}</Typography>
              <Box sx={{ mt: 2 }}>
                <Link
                  to={`/event/${event.id}`}
                  state={{ event }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                  >
                    View Details
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default EventList;
