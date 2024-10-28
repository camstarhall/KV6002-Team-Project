import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

function EventDetails() {
  const location = useLocation();
  const { event } = location.state; // Assuming event data is passed via state

  return (
    <Box
      className="event-details-content"
      sx={{
        textAlign: "center",
        padding: "2rem 1rem",
        backgroundColor: "#D08C8C",
        minHeight: "80vh",
      }}
    >
      <Typography variant="h4" sx={{ color: 'black', marginBottom: '1rem' }}>
        {event.title}
      </Typography>
      <img
        src={event.img}
        alt={event.title}
        style={{ width: "400px", height: "auto", marginBottom: "1rem" }}
      />
      <Typography variant="body1" sx={{ color: 'black', marginBottom: '1rem' }}>
        {event.description}
      </Typography>
      <Typography variant="h6" sx={{ color: 'black', marginBottom: '1rem' }}>
        Organizer: ROSE CHARITY
      </Typography>
      <Typography variant="h6" sx={{ color: 'black', marginBottom: '1rem' }}>
        Location: Any City
      </Typography>
      <Typography variant="h6" sx={{ color: 'black', marginBottom: '1rem' }}>
        Date: XX/XX/XXXX - Time: XX:XX AM/PM
      </Typography>
      <Typography variant="h6" sx={{ color: 'black', marginBottom: '1rem' }}>
        Spaces Left: XX
      </Typography>
      <Button variant="contained" color="primary">
        Book Now
      </Button>
    </Box>
  );
}

export default EventDetails;
