import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const SocialShareButtons = ({ event }) => {
  const eventURL = `https://k6002-2b4cf.web.app/event/${event.id}`;
  const encodedTitle = encodeURIComponent(event.title);
  const encodedDescription = encodeURIComponent(event.description);

  return (
    <Box sx={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outlined" color="primary">
          Facebook
        </Button>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outlined" color="secondary">
          Twitter
        </Button>
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle} - ${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outlined" color="success">
          WhatsApp
        </Button>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outlined" color="info">
          LinkedIn
        </Button>
      </a>
    </Box>
  );
};

function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const mockEvents = [
        {
          id: "1",
          title: "Charity Run",
          description: "Join us for a fun-filled charity run to support our community!",
          date: "2024-12-11",
          status: "Active",
        },
        {
          id: "2",
          title: "Food Drive",
          description: "Help us collect food for those in need in our local community.",
          date: "2024-12-09",
          status: "Cancelled",
        },
        {
          id: "3",
          title: "Community Meeting",
          description: "Discussing community development and support initiatives.",
          date: "2024-12-15",
          status: "Active",
        },
      ];

      // Filter for upcoming active events
      const today = new Date();
      const upcomingEvents = mockEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= today && event.status === "Active";
      });

      setEvents(upcomingEvents);
    };

    fetchEvents();
  }, []);

  if (events.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", marginTop: "2rem" }}>
        No upcoming events available.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8" }}>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "2rem" }}>
        Upcoming Events
      </Typography>

      {events.map((event) => (
        <Box
          key={event.id}
          sx={{
            padding: "1rem",
            marginBottom: "2rem",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
            {event.title}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
            {event.description}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
            Date: {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Link to={`/event-details/${event.id}`}>
            <Button variant="contained" color="primary" sx={{ marginBottom: "1rem" }}>
              View Details
            </Button>
          </Link>
          <Typography variant="subtitle1" sx={{ marginTop: "1rem", fontWeight: "bold" }}>
            Share this Event:
          </Typography>
          <SocialShareButtons event={event} />
        </Box>
      ))}
    </Box>
  );
}

export default Event;
