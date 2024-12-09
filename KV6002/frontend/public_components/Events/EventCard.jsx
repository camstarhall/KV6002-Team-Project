import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

const EventCard = ({ event }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#f5f5f5",
        boxShadow: 3,
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image at the Top */}
      <CardMedia
        component="img"
        height="300" // Increased height for better visibility
        image="https://media.istockphoto.com/id/1498170916/photo/a-couple-is-taking-a-bag-of-food-at-the-food-and-clothes-bank.jpg?s=1024x1024&w=is&k=20&c=ASXbBbzgxFx83RgmjnQoHssc6zTlPZlhZgSnKJhOPQ0=" // Replace with your placeholder image path
        alt={event.title}
        sx={{ objectFit: "cover" }}
      />

      {/* Event Details at the Bottom */}
      <CardContent
        sx={{
          flexGrow: 0,
          padding: "1rem", // Reduced padding
          maxHeight: "150px", // Limited maximum height for text
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", lineHeight: "1.2" }}
        >
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {event.date}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap", // Truncates text if too long
          }}
        >
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
