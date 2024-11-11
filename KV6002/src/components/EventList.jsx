// src/components/EventList.jsx

import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import { Link } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Retrieve events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 4, textAlign: "center" }}>
        Upcoming Events
      </Typography>
      {events.length === 0 ? (
        <Typography sx={{ color: "#7B3F3F", textAlign: "center" }}>No events available</Typography>
      ) : (
        events.map((event) => (
          <Card key={event.id} sx={{ display: "flex", mb: 2, backgroundColor: "#ffffff", boxShadow: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={event.imageUrl || "/placeholder.png"} // Default image if none uploaded
              alt={event.title}
            />
            <CardContent>
              <Typography variant="h5" sx={{ color: "#7B3F3F" }}>{event.title}</Typography>
              <Typography>Date: {event.date}</Typography>
              <Typography>Location: {event.location}</Typography>
              <Typography>Capacity: {event.capacity}</Typography>
              <Typography>Description: {event.description}</Typography>
              <Link to="/event-details" state={{ event }}>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default EventList;
