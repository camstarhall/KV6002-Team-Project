import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Card,
  CardContent,
  IconButton,
  TextField,
} from "@mui/material";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Date: "",
    Location: "",
    Description: "",
    imageURL: "",
    Capacity: 0,
    isRestricted: false,
    Status: "Active", // Default status
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

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
      alert("Failed to fetch events.");
    }
  };

  const generateUniqueCode = async () => {
    const existingCodes = events.map((event) => event.uniqueCode);
    let uniqueCode;
    do {
      uniqueCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code
    } while (existingCodes.includes(uniqueCode)); // Ensure the code is unique
    return uniqueCode;
  };

  const handleOpenModal = (event = null) => {
    setError("");
    if (event) {
      setFormData(event);
      setIsEdit(true);
      setCurrentEventId(event.id);
    } else {
      setFormData({
        Title: "",
        Date: "",
        Location: "",
        Description: "",
        imageURL: "",
        Capacity: 0,
        isRestricted: false,
        Status: "Active",
      });
      setIsEdit(false);
      setCurrentEventId(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEdit(false);
    setCurrentEventId(null);
    setUploading(false);
    setUploadSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.Capacity <= 0) {
      setError("The event capacity must be greater than 0.");
      return;
    }

    try {
      const eventsCollection = collection(db, "Events");
      if (isEdit && currentEventId) {
        const eventDoc = doc(db, "Events", currentEventId);
        await updateDoc(eventDoc, formData);
      } else {
        const uniqueCode = await generateUniqueCode(); // Generate unique 4-digit code
        const newEventData = {
          ...formData,
          uniqueCode,
        };
        await addDoc(eventsCollection, newEventData);
      }
      fetchEvents();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event.");
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const eventDoc = doc(db, "Events", eventId);
      await deleteDoc(eventDoc); // Delete the event
      fetchEvents(); // Refresh the event list
      console.log("Event deleted successfully:", eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds the 5MB limit.");
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    const storageRef = ref(storage, `event-images/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData({ ...formData, imageURL: downloadURL });
        setUploading(false);
        setUploadSuccess(true);
      }
    );
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8" }}>
      <Typography
        variant="h4"
        sx={{ color: "#7B3F3F", mb: 3 }}
      >
        Event Management
      </Typography>

      <Button
        variant="contained"
        onClick={() => handleOpenModal()}
        sx={{ mb: 3 }}
      >
        Add Event
      </Button>

      {events.map((event) => (
        <Card
          key={event.id}
          sx={{
            mb: 2,
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: event.Status === "Cancelled" ? 0.5 : 1,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                textDecoration:
                  event.Status === "Cancelled" ? "line-through" : "none",
              }}
            >
              {event.Title} {event.Status === "Cancelled" && "(Cancelled)"}
            </Typography>
            <Typography>Date: {event.Date}</Typography>
            <Typography>Location: {event.Location}</Typography>
            <Typography>Capacity: {event.Capacity}</Typography>
            <Typography>
              Restricted: {event.isRestricted ? "Yes" : "No"}
            </Typography>
            <Typography>Unique Code: {event.uniqueCode || "N/A"}</Typography>
            {event.imageURL && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={event.imageURL}
                  alt={event.Title}
                  style={{ maxWidth: "15%", height: "auto" }}
                />
              </Box>
            )}
          </CardContent>
          <Box>
            <IconButton
              color="primary"
              onClick={() => handleOpenModal(event)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(event.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Card>
      ))}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
      >
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: 2,
            width: { xs: "90%", sm: "500px" },
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            {isEdit ? "Edit Event" : "Add Event"}
          </Typography>
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}
          <TextField
            label="Title"
            name="Title"
            value={formData.Title}
            onChange={(e) =>
              setFormData({ ...formData, Title: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Date"
            name="Date"
            type="date"
            value={formData.Date}
            onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Location"
            name="Location"
            value={formData.Location}
            onChange={(e) =>
              setFormData({ ...formData, Location: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={(e) =>
              setFormData({ ...formData, Description: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Capacity"
            name="Capacity"
            type="number"
            value={formData.Capacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                Capacity: parseInt(e.target.value, 10),
              })
            }
            fullWidth
            sx={{ mb: 2 }}
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Who is this event for?"
            name="isRestricted"
            select
            value={formData.isRestricted ? "Restricted" : "Everyone"}
            onChange={(e) =>
              setFormData({
                ...formData,
                isRestricted: e.target.value === "Restricted",
              })
            }
            fullWidth
            sx={{ mb: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="Everyone">Everyone</option>
            <option value="Restricted">Just Target Group</option>
          </TextField>
          <Button
            variant={uploadSuccess ? "contained" : "outlined"}
            color={uploadSuccess ? "success" : "primary"}
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            {uploadSuccess
              ? "Image Uploaded Successfully"
              : "Upload Event Image"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleUploadImage}
            />
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth
          >
            {isEdit ? "Update Event" : "Add Event"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default EventManagement;
