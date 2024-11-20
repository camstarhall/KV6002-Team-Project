import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const EventDetails = () => {
  const location = useLocation();
  const event = location.state?.event;

  if (!event) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Event details not found.
      </Typography>
    );
  }

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ color: "#7B3F3F", mb: 4 }}
      >
        {event.Title}
      </Typography>
      <Typography>Date: {new Date(event.Date).toLocaleDateString()}</Typography>
      <Typography>Location: {event.Location}</Typography>
      <Typography>Description: {event.Description}</Typography>
      <Box
        component="img"
        src={event.imageUrl || "/placeholder.png"}
        alt={event.Title}
        sx={{ mt: 2, width: "100%", maxHeight: 300 }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default EventDetails;
