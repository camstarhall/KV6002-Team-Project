import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import EventCard from "./Events/EventCard";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from Firestore
  // filter these events to make sure theyre not in the past
  const fetchEvents = async () => {
    try {
      const currentDate = new Date(); // Get the current date and time

      const eventsCollection = collection(db, "Events");

      // Use the Firestore query operators correctly.
      // If "Date" field is stored as a string in ISO format, ensure you're comparing it correctly.
      // If it's stored as a Firestore Timestamp, you'll need to change the query accordingly.
      // For this example, let's assume Date is a string in "YYYY-MM-DD" format or an ISO string.
      const isoString = currentDate.toISOString().split("T")[0]; // Convert current date to YYYY-MM-DD if needed.

      const eventsQuery = query(
        eventsCollection,
        where("Date", ">=", isoString),
        orderBy("Date", "asc"),
        limit(3)
      );

      const eventsSnapshot = await getDocs(eventsQuery);

      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: { xs: "1rem", sm: "2rem", md: "4rem" },
        backgroundColor: "#D08C8C",
      }}
    >
      {/* Grid for Event Cards */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ mb: 4 }}
      >
        {loading ? (
          <Typography
            variant="body1"
            sx={{ mt: 3, color: "black" }}
          >
            Loading events...
          </Typography>
        ) : events.length > 0 ? (
          events.map((event) => (
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              key={event.id}
            >
              <EventCard
                event={{
                  id: event.id, // Pass the event ID for routing
                  title: event.Title,
                  date: event.Date,
                  description: event.Description,
                  imageUrl: event.imageURL,
                }}
              />
            </Grid>
          ))
        ) : (
          <Typography
            variant="body1"
            sx={{ mt: 3, color: "black" }}
          >
            No events available at the moment.
          </Typography>
        )}
      </Grid>

      <Typography
        variant="body1"
        sx={{ mt: 3, color: "black" }}
      >
        Join hands with us in bringing positive changes to the community. Every
        step makes a difference!
      </Typography>
    </Box>
  );
}

export default Home;
