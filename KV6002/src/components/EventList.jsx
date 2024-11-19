import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    Title: "",
    Date: "",
    Location: "",
    Description: "",
    imageUrl: "",
  });

  // Function to fetch events from Firestore
  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "Events");
      const eventsSnapshot = await getDocs(eventsCollection);
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

  // Open and close modal functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventsCollection = collection(db, "Events");
      await addDoc(eventsCollection, formData);
      setFormData({
        Title: "",
        Date: "",
        Location: "",
        Description: "",
        imageUrl: "",
      });
      handleClose();
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ color: "#7B3F3F", mb: 4, textAlign: "center" }}
      >
        Upcoming Events
      </Typography>
      {loading ? (
        <Typography sx={{ color: "#7B3F3F", textAlign: "center" }}>
          Loading events...
        </Typography>
      ) : events.length === 0 ? (
        <Typography sx={{ color: "#7B3F3F", textAlign: "center" }}>
          No events available
        </Typography>
      ) : (
        events.map((event) => (
          <Card
            key={event.id}
            sx={{
              display: "flex",
              mb: 2,
              backgroundColor: "#ffffff",
              boxShadow: 2,
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={event.imageUrl || "/placeholder.png"}
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
                Date:{" "}
                {new Date(event.Date).toLocaleDateString() ||
                  "Date not available"}
              </Typography>
              <Typography>Location: {event.Location}</Typography>
              <Typography>Description: {event.Description}</Typography>
              <Link
                to="/event-details"
                state={{ event }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}

      {/* Fixed Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "1.5rem",
        }}
      >
        +
      </Button>

      {/* Modal Form */}
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            mb={2}
          >
            Add New Event
          </Typography>
          <TextField
            fullWidth
            label="Title"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Location"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EventList;
