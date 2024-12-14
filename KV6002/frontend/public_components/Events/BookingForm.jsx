import React, { useState, useEffect } from "react";
import {
Box,
Typography,
TextField,
Button,
MenuItem,
Grid,
Snackbar,
Alert,
} from "@mui/material";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
const BookingForm = ({ event, onCancel }) => {
const [formData, setFormData] = useState({
fullName: "",
gender: "",
dateOfBirth: "",
email: "",
phone: "",
address: "",
employmentStatus: "",
monthlySalary: "",
phoneExtension: "60", // Default extension (Malaysia) changed from "+60" to "60"
});
const [currentCapacity, setCurrentCapacity] = useState(0);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [toastOpen, setToastOpen] = useState(false);
// Phone number extensions
const phoneExtensions = [
{ label: "Malaysia (+60)", value: "60", minLength: 9, maxLength: 11 },
{ label: "UK (+44)", value: "44", minLength: 10, maxLength: 13 },
{ label: "USA (+1)", value: "1", minLength: 10, maxLength: 11 },
{ label: "India (+91)", value: "91", minLength: 10, maxLength: 12 },
];
const isValidName = (name) => /^[A-Za-z\s]+$/.test(name.trim()) && !/^\d+$/.test(name.trim());
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const isValidAddress = (address) => address.trim().length >= 5;
const normalizePhoneNumber = (phone) => phone.replace(/^0+/, "");
const isValidPhone = (phone, extension) => {
const normalizedPhone = normalizePhoneNumber(phone);
const selectedExtension = phoneExtensions.find((ext) => ext.value === extension);
if (!selectedExtension) return false;
const phoneLength = normalizedPhone.length;
return (
/^[0-9]+$/.test(normalizedPhone) &&
phoneLength >= selectedExtension.minLength &&
phoneLength <= selectedExtension.maxLength
);
};
const calculateAge = (dateOfBirth) => {
const today = new Date();
const birthDate = new Date(dateOfBirth);
let age = today.getFullYear() - birthDate.getFullYear();
const monthDiff = today.getMonth() - birthDate.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
age--;
}
return age;
};
const fetchCurrentCapacity = async () => {
try {
const bookingsQuery = query(
collection(db, "Bookings"),
where("eventId", "==", event.id),
where("status", "==", "Booked")
);
const bookingsSnapshot = await getDocs(bookingsQuery);
setCurrentCapacity(bookingsSnapshot.docs.length);
} catch (error) {
console.error("Error fetching current capacity:", error);
}
};
useEffect(() => {
fetchCurrentCapacity();
}, []);
const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setSuccess("");
if (!isValidName(formData.fullName)) {
setError("Please enter a valid name (letters and spaces only).");
setToastOpen(true);
return;
}
if (event.isRestricted && formData.gender !== "Female") {
setError("This event is restricted to females only.");
setToastOpen(true);
return;
}
if (event.isRestricted) {
const age = calculateAge(formData.dateOfBirth);
if (age < 30 || age > 65) {
setError("Eligible participants must be between 30 and 65 years old.");
setToastOpen(true);
return;
}
}
if (!formData.phone.trim()) {
setError("A phone number is required to send your booking confirmation.");
setToastOpen(true);
return;
}
if (!isValidPhone(formData.phone, formData.phoneExtension)) {
setError("Please enter a valid phone number based on the selected extension.");
setToastOpen(true);
return;
}
if (formData.email && !isValidEmail(formData.email)) {
setError("Please enter a valid email address.");
setToastOpen(true);
return;
}
if (!isValidAddress(formData.address)) {
setError("Please enter a valid first line of address (at least 5 characters).");
setToastOpen(true);
return;
}
if (
event.isRestricted &&
formData.employmentStatus === "Employed" &&
parseFloat(formData.monthlySalary) >= 5250
) {
setError(
"Your monthly household income must be less than RM 5250 to qualify for booking."
);
setToastOpen(true);
return;
}
if (currentCapacity >= event.Capacity) {
setError("This event is fully booked.");
setToastOpen(true);
return;
}
const normalizedPhoneNumber = normalizePhoneNumber(formData.phone);
const fullPhoneNumber = formData.phoneExtension + normalizedPhoneNumber;
try {
const usersCollection = collection(db, "Users");
const bookingsCollection = collection(db, "Bookings");
const existingUserQuery = query(
usersCollection,
where("phone", "==", fullPhoneNumber)
);
const existingUserSnapshot = await getDocs(existingUserQuery);
let userId;
if (existingUserSnapshot.empty) {
const userDoc = await addDoc(usersCollection, {
fullName: formData.fullName,
gender: event.isRestricted ? formData.gender : null,
dateOfBirth: event.isRestricted ? formData.dateOfBirth : null,
email: formData.email || null,
phone: fullPhoneNumber,
address: formData.address,
employmentStatus: event.isRestricted
? formData.employmentStatus
: null,
monthlySalary: event.isRestricted ? formData.monthlySalary : null,
});
userId = userDoc.id;
} else {
userId = existingUserSnapshot.docs[0].id;
}
const existingBookingQuery = query(
bookingsCollection,
where("eventId", "==", event.id),
where("phone", "==", fullPhoneNumber),
where("status", "==", "Booked")
);
const existingBookingSnapshot = await getDocs(existingBookingQuery);
if (!existingBookingSnapshot.empty) {
setError("You have already booked this event. Only one active booking is allowed per event.");
setToastOpen(true);
return;
}
await addDoc(bookingsCollection, {
eventId: event.id,
eventTitle: event.Title,
phone: fullPhoneNumber,
email: formData.email || null,
status: "Booked",
bookingDate: new Date().toISOString(),
userId: userId,
eventDate: event.Date,
uniqueCode: event.uniqueCode,
});
setSuccess("Booking successful!");
setToastOpen(true);
setFormData({
fullName: "",
gender: "",
dateOfBirth: "",
email: "",
phone: "",
address: "",
employmentStatus: "",
monthlySalary: "",
phoneExtension: "60",
});
fetchCurrentCapacity();
} catch (err) {
console.error("Error saving booking:", err);
setError("An error occurred while processing your booking.");
setToastOpen(true);
}
};
const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};
return (
<Box
component="form"
onSubmit={handleSubmit}
sx={{
padding: "2rem",
backgroundColor: "white",
borderRadius: "8px",
boxShadow: 3,
maxWidth: "500px",
margin: "auto",
mt: 4,
}}
>
<Typography
variant="h6"
sx={{ mb: 2, color: "#7B3F3F" }}
>
Book / RSVP for {event.Title}
</Typography>
<TextField
label="Full Name"
name="fullName"
value={formData.fullName}
onChange={handleInputChange}
fullWidth
required
sx={{ mb: 2 }}
/>
{event.isRestricted && (
<>
<TextField
select
label="Gender"
name="gender"
value={formData.gender}
onChange={handleInputChange}
fullWidth
required
sx={{ mb: 2 }}
>
<MenuItem value="Male">Male</MenuItem>
<MenuItem value="Female">Female</MenuItem>
</TextField>
<TextField
label="Date of Birth"
name="dateOfBirth"
type="date"
value={formData.dateOfBirth}
onChange={handleInputChange}
fullWidth
required
InputLabelProps={{ shrink: true }}
sx={{ mb: 2 }}
/>
</>
)}
<TextField
label="Email Address"
name="email"
type="email"
value={formData.email}
onChange={handleInputChange}
fullWidth
sx={{ mb: 2 }}
/>
<Grid container spacing={2} sx={{ mb: 2 }}>
<Grid item xs={4}>
<TextField
select
label="Ext."
name="phoneExtension"
value={formData.phoneExtension}
onChange={handleInputChange}
fullWidth
>
{phoneExtensions.map((ext) => (
<MenuItem key={ext.value} value={ext.value}>
{ext.label}
</MenuItem>
))}
</TextField>
</Grid>
<Grid item xs={8}>
<TextField
label="Phone Number"
name="phone"
value={formData.phone}
onChange={handleInputChange}
fullWidth
required
/>
</Grid>
</Grid>
<TextField
label="First Line of Address"
name="address"
value={formData.address}
onChange={handleInputChange}
fullWidth
required
sx={{ mb: 2 }}
/>
{event.isRestricted && (
<>
<TextField
select
label="Employment Status"
name="employmentStatus"
value={formData.employmentStatus}
onChange={handleInputChange}
fullWidth
required
sx={{ mb: 2 }}
>
<MenuItem value="Employed">Employed</MenuItem>
<MenuItem value="Unemployed">Unemployed</MenuItem>
</TextField>
{formData.employmentStatus === "Employed" && (
<TextField
label="Monthly Household Income (RM)"
name="monthlySalary"
type="number"
value={formData.monthlySalary}
onChange={handleInputChange}
fullWidth
required
sx={{ mb: 2 }}
/>
)}
</>
)}
<Box sx={{ display: "flex", gap: 2 }}>
<Button type="submit" variant="contained" color="primary">
Submit
</Button>
<Button onClick={onCancel} variant="outlined" color="secondary">
Cancel
</Button>
</Box>
{/* Toast notifications */}
<Snackbar
open={toastOpen}
autoHideDuration={3000}
onClose={() => setToastOpen(false)}
anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
{(error || success) && (
<Alert
onClose={() => setToastOpen(false)}
severity={error ? "error" : "success"}
sx={{ width: "100%" }}
>
{error || success}
</Alert>
)}
</Snackbar>
</Box>
);
};
export default BookingForm; 



