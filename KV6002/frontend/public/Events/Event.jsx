import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link for navigation
import EventImg1 from "../assets/EventImages/EventImg1.png";
import EventImg2 from "../assets/EventImages/EventImg2.png";
import EventImg3 from "../assets/EventImages/EventImg3.png";

// Sample events data with additional date field
const events = [
  {
    id: 1,
    img: EventImg1,
    title: "Charity Run",
    description: "Join us for a fun-filled charity run to support our community!",
    date: "2024-11-01",
  },
  {
    id: 2,
    img: EventImg2,
    title: "Food Drive",
    description: "Help us collect food for those in need in our local community.",
    date: "2024-12-01",
  },
  {
    id: 3,
    img: EventImg3,
    title: "Community Clean-up",
    description: "Be a part of our community clean-up day and make a difference!",
    date: "2024-10-15",
  },
];

function Event() {
  const [searchTerm, setSearchTerm] = useState(""); // For title filtering
  const [filterDate, setFilterDate] = useState(""); // For date filtering

  // Filter events based on title and date
  const filteredEvents = events.filter(event => {
    const matchesTitle = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? event.date === filterDate : true; // If date is not set, include all
    return matchesTitle && matchesDate;
  });

  return (
    <Box
      className="event-content"
      sx={{
        textAlign: "center",
        padding: "2rem 1rem",
        backgroundColor: "#D08C8C",
        minHeight: "80vh",
      }}
    >
      <Typography variant="h4" sx={{ color: 'black', marginBottom: '1rem' }}>
        Upcoming Events
      </Typography>
      <Typography variant="body1" sx={{ color: 'black', marginBottom: '1rem' }}>
        Join us for our upcoming events and make a difference in the community!
      </Typography>

      {/* Filter Inputs */}
      <Box sx={{ marginBottom: "2rem" }}>
        <TextField
          label="Search by Title"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginRight: "1rem" }}
        />
        <TextField
          label="Filter by Date"
          type="date"
          variant="outlined"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </Box>

      {/* Event Rows */}
      {filteredEvents.map((event) => (
        <Box
          key={event.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 1,
            padding: "1rem",
          }}
        >
          <img
            src={event.img}
            alt={event.title}
            style={{ width: "200px", height: "auto", marginRight: "1rem" }}
          />
          <Box sx={{ flexGrow: 1, textAlign: "left" }}>
            <Typography variant="h6" sx={{ color: 'black' }}>
              {event.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
              {event.description}
            </Typography>
            <Link to="/event-details" state={{ event }}>
              <Button variant="contained" color="primary" sx={{ marginTop: "1rem" }}>
                View Details
              </Button>
            </Link>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Event;
