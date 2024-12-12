import React from "react";
import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <Link
      to={`/event/${event.id}`} // Dynamically generates the URL for event details
      style={{
        textDecoration: "none", // Removes underline from the link
        color: "inherit", // Inherits text color to keep the design consistent
      }}
    >
      <Card
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: 3,
          minHeight: "400px", // Increased height
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px", // Rounded corners
          overflow: "hidden", // Ensure content stays within rounded edges
          padding: "8px", // Inner margin for white gap around card
          transition: "transform 0.2s", // Add a subtle hover effect
          "&:hover": {
            transform: "scale(1.03)", // Slight zoom on hover
          },
        }}
      >
        {/* Image at the Top */}
        <Box
          sx={{
            overflow: "hidden", // Ensure image respects the inner margin
            borderRadius: "12px", // Slightly rounded inner corners for the image
          }}
        >
          <CardMedia
            component="img"
            height="250" // Taller image for better proportions
            image={event.imageUrl}
            alt={event.title}
            sx={{
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Event Details */}
        <CardContent
          sx={{
            flexGrow: 1,
            padding: "1rem", // Adds padding inside the card
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              lineHeight: "1.2",
              marginBottom: "0.5rem",
              overflow: "hidden", // Truncates title if too long
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {event.title || "Event Title"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              marginBottom: "0.5rem",
              overflow: "hidden", // Truncates date if too long
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {event.date || "Time & Location"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: "1.5",
              overflow: "hidden", // Truncates description if too long
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3, // Limits text to 3 lines
            }}
          >
            {event.description || "About the event"}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
