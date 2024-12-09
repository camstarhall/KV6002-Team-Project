import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  LinearProgress, // Import LinearProgress for progress bar
} from "@mui/material";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig"; // Import storage
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Use uploadBytesResumable

const SocialShareButtons = ({ event }) => {
  const eventURL = `https://www.myevents.com/events/${event.id}`;
  const encodedTitle = encodeURIComponent(event.Title);
  const encodedDescription = encodeURIComponent(event.Description);

  return (
    <Box sx={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          variant="outlined"
          color="primary"
        >
          Facebook
        </Button>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          variant="outlined"
          color="secondary"
        >
          Twitter
        </Button>
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle} - ${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          variant="outlined"
          color="success"
        >
          WhatsApp
        </Button>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          variant="outlined"
          color="info"
        >
          LinkedIn
        </Button>
      </a>
    </Box>
  );
};

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Date: "",
    Location: "",
    Description: "",
    imageURL: "",
    Capacity: 0,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [uploading, setUploading] = useState(false); // Upload status
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress
  const [imagePreview, setImagePreview] = useState(null); // Image preview

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
      console.log("Fetched events:", eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events.");
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setFormData(event);
      setIsEdit(true);
      setCurrentEventId(event.id);
      setImagePreview(event.imageURL); // Set image preview when editing
    } else {
      setFormData({
        Title: "",
        Date: "",
        Location: "",
        Description: "",
        imageURL: "",
        Capacity: 0,
      });
      setImagePreview(null); // Reset image preview when adding
      setIsEdit(false);
      setCurrentEventId(null);
    }
    setModalOpen(true);
    console.log("Modal opened:", event ? "Edit" : "Add");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEdit(false);
    setCurrentEventId(null);
    setUploading(false);
    setUploadProgress(0);
    setImagePreview(null);
    console.log("Modal closed");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const eventsCollection = collection(db, "Events");

    try {
      if (isEdit && currentEventId) {
        const eventDoc = doc(db, "Events", currentEventId);
        await updateDoc(eventDoc, formData);
        console.log("Event updated:", currentEventId);
      } else {
        await addDoc(eventsCollection, formData);
        console.log("Event added:", formData);
      }
      fetchEvents();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event.");
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteEventId(id);
    setDeleteDialogOpen(true);
    console.log("Delete dialog opened for event:", id);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteEventId(null);
    console.log("Delete dialog closed");
  };

  const handleDelete = async () => {
    try {
      if (deleteEventId) {
        const eventDoc = doc(db, "Events", deleteEventId);
        await deleteDoc(eventDoc);
        console.log("Event deleted:", deleteEventId);
        fetchEvents();
        handleCloseDeleteDialog();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  // Enhanced image upload handler with progress tracking
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG, and GIF files are allowed.");
      return;
    }

    // File size validation (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds 5MB.");
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `event-images/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate progress percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload error:", error);
        alert("Failed to upload image. Please try again.");
        setUploading(false);
        setUploadProgress(0);
      },
      async () => {
        // Handle successful uploads on complete
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL obtained:", downloadURL);

          // Ensure downloadURL is a plain string without extra quotes
          if (typeof downloadURL === "string" && !/^".*"$/.test(downloadURL)) {
            setFormData((prevData) => ({
              ...prevData,
              imageURL: downloadURL,
            }));

            // Set image preview
            setImagePreview(downloadURL);
            console.log("Image preview set.");
          } else {
            console.error("downloadURL has unexpected format:", downloadURL);
            alert("Failed to retrieve valid image URL.");
          }
        } catch (error) {
          console.error("Error getting download URL:", error);
          alert("Failed to retrieve image URL.");
        } finally {
          setUploading(false);
          setUploadProgress(0);
        }
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
          }}
        >
          <CardContent>
            <Typography variant="h6">{event.Title}</Typography>
            <Typography>Date: {event.Date}</Typography>
            <Typography>Location: {event.Location}</Typography>
            <Typography>Capacity: {event.Capacity}</Typography>
            {event.imageURL && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={event.imageURL}
                  alt={event.Title}
                  style={{ maxWidth: "15%", height: "auto" }}
                />
              </Box>
            )}
            <SocialShareButtons event={event} /> {/* Add Share Buttons */}
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
              onClick={() => handleOpenDeleteDialog(event.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Card>
      ))}

      {/* Modal for Add/Edit */}
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

          {/* Image Upload Section */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1 }}
            >
              Event Image
            </Typography>
            {imagePreview && (
              <Box sx={{ mb: 1 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "70%", height: "auto" }}
                />
              </Box>
            )}
            <Button
              variant="contained"
              component="label"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
            {uploading && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  Uploading: {Math.round(uploadProgress)}%
                </Typography>
              </Box>
            )}
            {formData.imageURL && !uploading && (
              <Typography
                variant="body2"
                color="green"
                sx={{ mt: 1 }}
              >
                Image uploaded successfully.
              </Typography>
            )}
          </Box>

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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={uploading}
          >
            {isEdit ? "Update Event" : "Add Event"}
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventManagement;
