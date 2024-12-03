import React, { useState } from "react";
import { Box, Typography, Button, TextField, Snackbar, Alert } from "@mui/material";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setErrorMessage("Feedback cannot be empty");
      return;
    }

    try {
      // Retrieve existing feedback from localStorage, or initialize to an empty array
      const feedbackList = JSON.parse(localStorage.getItem("feedbacks")) || [];
      
      // Add the new feedback to the array
      feedbackList.push({ text: feedback, date: new Date().toISOString() });
      
      // Store the updated array back in localStorage
      localStorage.setItem("feedbacks", JSON.stringify(feedbackList));
      
      setSuccessMessage("Feedback submitted successfully!");
      setFeedback("");  // Clear the input field after submission
    } catch (error) {
      setErrorMessage("Failed to save feedback");
    }
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#D08C8C", minHeight: "80vh", textAlign: "center" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 2 }}>Event Feedback</Typography>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
        {errorMessage && <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>}
        {successMessage && <Snackbar open autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>}
        
        <TextField
          label="Your Feedback"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white", mb: 2 }}
        />
        <Button type="submit" variant="contained" sx={{ backgroundColor: "#7B3F3F", color: "white" }}>
          Submit Feedback
        </Button>
      </form>
    </Box>
  );
};

export default Feedback;