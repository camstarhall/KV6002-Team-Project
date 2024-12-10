import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "Events");
      const eventDocs = await getDocs(eventsCollection);
      const eventsData = eventDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const validateFeedback = (feedbackText) => {
    const maxWords = 50;

    if (!selectedEvent) {
      setErrorMessage("Please select an event before submitting feedback.");
      return false;
    }

    if (!feedbackText.trim()) {
      setErrorMessage("Feedback cannot be empty.");
      return false;
    }

    const wordCount = feedbackText.trim().split(/\s+/).length;
    if (wordCount > maxWords) {
      setErrorMessage(`Feedback cannot exceed ${maxWords} words.`);
      return false;
    }

    return true;
  };

  const sanitizeInput = (input) => input.trim().replace(/<[^>]*>?/gm, "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFeedback(feedback)) {
      return;
    }

    try {
      const sanitizedFeedback = sanitizeInput(feedback);

      const feedbackCollection = collection(db, "Feedbacks");
      await addDoc(feedbackCollection, {
        eventId: selectedEvent,
        feedback: sanitizedFeedback,
        createdAt: new Date().toISOString(),
      });

      setSuccessMessage("Feedback submitted successfully!");
      setFeedback(""); // Clear the input field
      setSelectedEvent(""); // Reset event selection
    } catch (error) {
      setErrorMessage("Failed to submit feedback. Please try again.");
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: "#D08C8C",
        minHeight: "80vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 2 }}>
        Event Feedback
      </Typography>

      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
        {errorMessage && (
          <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
            <Alert severity="error">{errorMessage}</Alert>
          </Snackbar>
        )}
        {successMessage && (
          <Snackbar open autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
            <Alert severity="success">{successMessage}</Alert>
          </Snackbar>
        )}

        <Select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          fullWidth
          displayEmpty
          sx={{ backgroundColor: "white", mb: 2 }}
        >
          <MenuItem value="" disabled>
            Select Event
          </MenuItem>
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.Title}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Your Feedback"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white", mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#7B3F3F", color: "white" }}
        >
          Submit Feedback
        </Button>
      </form>
    </Box>
  );
};

export default Feedback;
