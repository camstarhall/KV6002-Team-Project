import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tooltip,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [filterMethod, setFilterMethod] = useState("Date");
  const [sortOrder, setSortOrder] = useState("Ascending");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch events from Firestore
  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "Events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      setFilteredEvents(eventsData); // Initialize filtered events
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter and sort events
  useEffect(() => {
    let filtered = events;

    // Filter out past events if the toggle is off
    if (!showPastEvents) {
      const today = new Date();
      filtered = filtered.filter((event) => new Date(event.Date) >= today);
    }

    // Sort events based on selected method and order
    if (filterMethod === "Date") {
      filtered.sort((a, b) =>
        sortOrder === "Ascending"
          ? new Date(a.Date) - new Date(b.Date)
          : new Date(b.Date) - new Date(a.Date)
      );
    } else if (filterMethod === "Alphabetical") {
      filtered.sort((a, b) =>
        sortOrder === "Ascending"
          ? a.Title.localeCompare(b.Title)
          : b.Title.localeCompare(a.Title)
      );
    }

    setFilteredEvents(filtered);
  }, [events, showPastEvents, filterMethod, sortOrder]);

  // Share event function
  const handleShare = (eventId) => {
    const eventLink = `https://k6002-2b4cf.web.app/event/${eventId}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this event!",
          url: eventLink,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(eventLink).then(() => {
        setSnackbarMessage("Link copied to clipboard!");
        setSnackbarOpen(true);
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#D08C8C", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ color: "#000000", mb: 4, textAlign: "center" }}
      >
        Upcoming Events
      </Typography>

      <Typography
        variant="h6"
        sx={{ color: "#000000", mb: 4, textAlign: "center" }}
      >
        Join us for our upcoming events and make a difference in the community!
      </Typography>

      {/* Controls for filtering and sorting */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        {/* Show Past Events Option */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Checkbox
            checked={showPastEvents}
            onChange={(e) => setShowPastEvents(e.target.checked)}
            sx={{ color: "green" }}
          />
          <Typography sx={{ color: "green", fontWeight: "bold" }}>
            Show Past Events
          </Typography>
        </Box>

        {/* Filtering Options */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <FormControl
            sx={{
              minWidth: 150,
              backgroundColor: "green",
              borderRadius: "4px",
              "& .MuiInputBase-root": {
                color: "white",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            <InputLabel id="filter-method-label">Filter By</InputLabel>
            <Select
              labelId="filter-method-label"
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
            >
              <MenuItem value="Date">Date</MenuItem>
              <MenuItem value="Alphabetical">Alphabetical</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: 150,
              backgroundColor: "green",
              borderRadius: "4px",
              "& .MuiInputBase-root": {
                color: "white",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            <InputLabel id="sort-order-label">Sort Order</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="Ascending">Ascending</MenuItem>
              <MenuItem value="Descending">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Event Cards */}
      {loading ? (
        <Typography sx={{ color: "#7B3F3F", textAlign: "center" }}>
          Loading events...
        </Typography>
      ) : filteredEvents.length === 0 ? (
        <Typography sx={{ color: "#7B3F3F", textAlign: "center" }}>
          No events available
        </Typography>
      ) : (
        filteredEvents.map((event) => (
          <Card
            key={event.id}
            sx={{
              display: "flex",
              mb: 2,
              backgroundColor: "#ffffff",
              boxShadow: 2,
              position: "relative",
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={event.imageURL || "/placeholder.png"}
              alt={event.Title}
            />
            <CardContent>
              <Typography
                variant="h5"
                sx={{ color: "#7B3F3F" }}
              >
                {event.Title}
              </Typography>
              <Typography>
                Date: {new Date(event.Date).toLocaleDateString()}
              </Typography>
              <Typography>Location: {event.Location}</Typography>

              {/* Restriction Indicator */}
              <Box
                sx={{
                  mt: 2,
                  border: `2px solid ${
                    event.isRestricted ? "orange" : "green"
                  }`,
                  color: event.isRestricted ? "orange" : "green",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  display: "inline-block",
                  backgroundColor: "#ffffff",
                  cursor: event.isRestricted ? "pointer" : "default",
                }}
              >
                {event.isRestricted ? (
                  <Tooltip
                    title="This event is limited to our target charity audience. Extra information will be requested on the booking page. Visit the About page for more details."
                    arrow
                  >
                    <Typography variant="body2">
                      Eligible groups only
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography variant="body2">Everybody is welcome</Typography>
                )}
              </Box>

              <Box
                sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}
              >
                {/* Share Icon */}
                <Tooltip
                  title="Share this event"
                  arrow
                >
                  <IconButton
                    onClick={() => handleShare(event.id)}
                    color="primary"
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>

                <Link
                  to={`/event/${event.id}`}
                  state={{ event }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                  >
                    View Details
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {/* Snackbar for Copy Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default EventList;
