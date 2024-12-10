import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, IconButton, CircularProgress } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const FeedbackView = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const feedbackCollection = collection(db, "Feedbacks");
      const feedbackSnapshot = await getDocs(feedbackCollection);

      const feedbackData = await Promise.all(
        feedbackSnapshot.docs.map(async (feedbackDoc) => {
          const feedback = feedbackDoc.data();
          let eventTitle = "Unknown Event";

          try {
            // Fetch the event's title based on the `eventId` in the feedback document
            const eventDoc = await getDoc(doc(db, "Events", feedback.eventId));
            if (eventDoc.exists()) {
              const eventData = eventDoc.data();
              eventTitle = eventData.Title || "Unknown Event";
            }
          } catch (error) {
            console.error("Error fetching event data:", error);
          }

          return {
            id: feedbackDoc.id,
            ...feedback,
            eventTitle,
          };
        })
      );

      setFeedbacks(feedbackData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await deleteDoc(doc(db, "Feedbacks", feedbackId));
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackId));
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", borderRadius: "8px", minHeight: "80vh" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 3, textAlign: "center" }}>
        User Feedback
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : feedbacks.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 4, color: "#7B3F3F" }}>
          No feedback available.
        </Typography>
      ) : (
        feedbacks.map((feedback) => (
          <Card
            key={feedback.id}
            sx={{
              mb: 2,
              boxShadow: 2,
              backgroundColor: "#fdf0f0",
              position: "relative",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#7B3F3F" }}>
                Event: {feedback.eventTitle}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: "#000" }}>
                Feedback: {feedback.feedback}
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: "gray", mt: 1 }}>
                Submitted on: {new Date(feedback.createdAt).toLocaleDateString()}
              </Typography>
              <IconButton
                onClick={() => handleDeleteFeedback(feedback.id)}
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
