import React from "react";
import { Grid } from "@mui/material";
import EventCard from "./EventCard";

const events = [
  {
    // obviously these would be fetched via the backend once that implementation is done
    title: "Charity Run (Fundraiser)",
    description: "Join us for a 5k run to support ROSE.",
    image: "https://via.placeholder.com/300x140",
  },
  {
    title: "Screening Event",
    description: "Get your cervicval cancer screening done for free.",
    image: "https://via.placeholder.com/300x140",
  },
  {
    title: "Charity Auction",
    description: "Bid on items to support ROSE.",
    image: "https://via.placeholder.com/300x140",
  },
];

function EventList() {
  return (
    <Grid
      container
      spacing={4}
      paddingLeft={2}
    >
      {events.map((event, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={index}
        >
          <EventCard event={event} />
        </Grid>
      ))}
    </Grid>
  );
}

export default EventList;
