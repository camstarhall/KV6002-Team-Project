import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

function Help() {
  const helpContacts = [
    {
      title: "Booking Assistance",
      phone: "+44 123 456 7890",
      email: "booking@rosecharityevents.org",
      description: "For help with booking events, especially for those without internet access.",
    },
    {
      title: "Event Cancellations",
      phone: "+44 987 654 3210",
      email: "cancellations@rosecharityevents.org",
      description: "Contact us if you need to cancel an event booking.",
    },
    {
      title: "General Inquiries",
      phone: "+44 555 123 4567",
      email: "info@rosecharityevents.org",
      description: "For any other questions or feedback about our services.",
    },
  ];

  return (
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: "#f8e8e8",
        minHeight: "80vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 3 }}>
        Help & Support
      </Typography>
      <Typography variant="body1" sx={{ color: "#7B3F3F", mb: 3 }}>
        We are here to assist you with any questions or issues. Contact us through the appropriate channels below.
      </Typography>

      {helpContacts.map((contact, index) => (
        <Card
          key={index}
          sx={{
            maxWidth: "600px",
            margin: "1rem auto",
            padding: "1rem",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#7B3F3F", mb: 1 }}>
              {contact.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {contact.description}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Phone:</strong> {contact.phone}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {contact.email}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Help;
