import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Select,
} from "@mui/material";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const LeaderDashboard = () => {
  const [outreachLog, setOutreachLog] = useState([]);
  const [formData, setFormData] = useState({
    eventId: "",
    peopleReached: "",
    method: "",
    details: "",
    outreachDate: "",
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchOutreachLogs();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventsCollection = collection(db, "Events");
      const eventDocs = await getDocs(eventsCollection);
      const eventsData = eventDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOutreachLogs = async () => {
    try {
      const outreachCollection = collection(db, "OutreachLogs");
      const outreachDocs = await getDocs(outreachCollection);
      const outreachData = outreachDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOutreachLog(outreachData);
    } catch (error) {
      console.error("Error fetching outreach logs:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOutreach = async () => {
    if (!formData.eventId || !formData.peopleReached || !formData.method || !formData.outreachDate) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const outreachCollection = collection(db, "OutreachLogs");
      await addDoc(outreachCollection, { ...formData, createdAt: new Date().toISOString() });
      fetchOutreachLogs();
      setFormData({ eventId: "", peopleReached: "", method: "", details: "", outreachDate: "" });
    } catch (error) {
      console.error("Error adding outreach log:", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f8e8e8", padding: "2rem", borderRadius: "8px", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 3, textAlign: "center" }}>
        Local Leader Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, textAlign: "center", color: "#7B3F3F" }}>
        Use this dashboard to log your outreach activities for events. Provide details on people reached,
        methods used, and additional details to support outreach efforts.
      </Typography>

      {/* Outreach Log Form */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
        <Select
          value={formData.eventId}
          onChange={handleInputChange}
          name="eventId"
          displayEmpty
          fullWidth
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
          label="People Reached"
          name="peopleReached"
          type="number"
          value={formData.peopleReached}
          onChange={handleInputChange}
          fullWidth
        />
        <Select
          value={formData.method}
          onChange={handleInputChange}
          name="method"
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Select Method
          </MenuItem>
          <MenuItem value="WhatsApp">WhatsApp</MenuItem>
          <MenuItem value="Facebook">Facebook</MenuItem>
          <MenuItem value="Instagram">Instagram</MenuItem>
          <MenuItem value="Flyers">Flyers</MenuItem>
          <MenuItem value="Posters">Posters</MenuItem>
        </Select>
        <TextField
          label="Additional Details"
          name="details"
          value={formData.details}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Date of Outreach"
          name="outreachDate"
          type="date"
          value={formData.outreachDate}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#7B3F3F", color: "white" }}
          onClick={handleAddOutreach}
        >
          Log Outreach
        </Button>
      </Box>

      {/* Outreach Logs */}
      <Typography variant="h6" sx={{ mb: 2, color: "#7B3F3F" }}>
        Outreach Summary
      </Typography>
      <List>
        {outreachLog.map((log) => (
          <ListItem
            key={log.id}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "4px",
              boxShadow: 1,
              mb: 1,
              padding: "1rem",
              "&:hover": { backgroundColor: "#f0d6d6" },
            }}
          >
            <ListItemText
              primary={
                <Typography sx={{ color: "#7B3F3F" }}>
                  Event: {events.find((e) => e.id === log.eventId)?.Title || "Unknown Event"}
                </Typography>
              }
              secondary={
                <>
                  <Typography sx={{ color: "black" }}>People Reached: {log.peopleReached}</Typography>
                  <Typography sx={{ color: "black" }}>Method: {log.method}</Typography>
                  <Typography sx={{ color: "black" }}>Outreach Date: {log.outreachDate}</Typography>
                  {log.details && (
                    <Typography sx={{ color: "black" }}>Details: {log.details}</Typography>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LeaderDashboard;
