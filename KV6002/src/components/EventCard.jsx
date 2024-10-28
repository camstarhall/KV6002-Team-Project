import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from "@mui/material";

function EventCard({ event }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={event.image}
        alt={event.title}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
        >
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {event.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default EventCard;
