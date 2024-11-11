import React from "react";
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5">{event.title}</Typography>
        <Typography variant="body2" color="text.secondary">{event.date}</Typography>
        <Typography variant="body2">{event.description}</Typography>
      </CardContent>
      <CardActions>
        <Link to={`/event-details`} state={{ event }}>
          <Button variant="contained" sx={{ backgroundColor: "#7B3F3F", color: "white" }}>
            View Details
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default EventCard;
