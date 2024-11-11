// src/components/FeedbackView.jsx

import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

const FeedbackView = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const storedFeedback = JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbacks(storedFeedback);
  }, []);

  const handleDeleteFeedback = (index) => {
    const updatedFeedbacks = feedbacks.filter((_, i) => i !== index);
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>User Feedback</Typography>
      {feedbacks.length === 0 ? (
        <Typography>No feedback available.</Typography>
      ) : (
        feedbacks.map((feedback, index) => (
          <Card key={index} sx={{ mb: 2, boxShadow: 2, backgroundColor: "#fdf0f0", position: "relative" }}>
            <CardContent>
              <Typography variant="body1" sx={{ color: "#7B3F3F" }}>{feedback.text}</Typography>
              <Typography variant="caption" display="block" sx={{ color: "gray", mt: 1 }}>
                Date: {feedback.date}
              </Typography>
              <IconButton
                onClick={() => handleDeleteFeedback(index)}
                sx={{ position: "absolute", top: "8px", right: "8px", color: "#7B3F3F" }}
              >
                <Delete />
              </IconButton>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default FeedbackView;
