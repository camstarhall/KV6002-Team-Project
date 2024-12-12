import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tooltip,
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
      sx={{ padding: "2rem", backgroundColor: "#D08C8C", minHeight: "100vh" }}
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
              position: "relative",
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

              {/* Restriction Indicator */}
              <Box
                sx={{
                  mt: 2,
                  border: `2px solid ${
                    event.isRestricted ? "orange" : "green"
                  }`,
                  color: event.isRestricted ? "orange" : "green",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  display: "inline-block",
                  backgroundColor: "#ffffff",
                  cursor: event.isRestricted ? "pointer" : "default",
                }}
              >
                {event.isRestricted ? (
                  <Tooltip
                    title="This event is limited to our target charity audience. Visit the About page for more details."
                    arrow
                  >
                    <Typography variant="body2">
                      Target charity audience only
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography variant="body2">Everybody is welcome</Typography>
                )}
              </Box>

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
