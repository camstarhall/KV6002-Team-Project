import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header"; // Import your Header component
import Footer from "./components/Footer"; // Import your Footer component
import Home from "./components/Home"; // Import your Home component
import Login from "./components/Login"; // Import your Login component
import Register from "./components/Register"; // Import your Register component
import Event from "./components/Event"; // Import your Event component
import EventDetails from "./components/EventDetails"; // Import your EventDetails component
import EventListAdminView from "./components/EventListAdminView"; // Import the new component

//Firebase:
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBPMdDaVgCHwjlpjzaljnzTB7RuOFnO7L4",

  authDomain: "k6002-2b4cf.firebaseapp.com",

  projectId: "k6002-2b4cf",

  storageBucket: "k6002-2b4cf.appspot.com",

  messagingSenderId: "377107045296",

  appId: "1:377107045296:web:2be5984ec8bbb736265475",

  measurementId: "G-4QMSHTY8LW"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//DB Structure

//User
async function addUser(user) {
  const userRef = await addDoc(collection(db, 'users'), {
    name: user.name,
    email: user.email,
    password: user.password,
    phone_number: user.phone_number,
    user_type: user.user_type, // "admin" or "endUser"
    date_joined: Timestamp.fromDate(new Date(user.date_joined))
  });

  if (user.user_type === 'admin') {
    // Add admin sub-collection
    await setDoc(doc(db, `users/${userRef.id}/admin`, 'details'), {
      role: user.role,
      permissions: user.permissions,
      created_events: user.created_events || []
    });
  } else if (user.user_type === 'endUser') {
    // Add endUser sub-collection
    await setDoc(doc(db, `users/${userRef.id}/endUser`, 'details'), {
      booking_history: user.booking_history || [],
      favorites: user.favorites || [],
      preferences: user.preferences || {}
    });
  }

  console.log(`User added with ID: ${userRef.id}`);
}

// Event Document
async function addEvent(event) {
  const eventRef = await addDoc(collection(db, 'events'), {
    name: event.name,
    description: event.description,
    date_time: Timestamp.fromDate(new Date(event.date_time)),
    location: doc(db, `venues/${event.locationId}`), // Reference to a venue document
    category: doc(db, `categories/${event.categoryId}`), // Reference to a category document
    organiser_id: doc(db, `users/${event.organiserId}`), // Reference to an admin user document
    capacity: event.capacity,
    available_spots: event.available_spots,
    price: event.price || null
  });

  console.log(`Event added with ID: ${eventRef.id}`);
}

// Venue
async function addVenue(venue) {
  const venueRef = await addDoc(collection(db, 'venues'), {
    name: venue.name,
    location: venue.location,
    capacity: venue.capacity,
    contact_info: venue.contact_info // Map containing phone, email, etc.
  });

  console.log(`Venue added with ID: ${venueRef.id}`);
}

//Booking
async function addBooking(booking) {
  const bookingRef = await addDoc(collection(db, 'bookings'), {
    event_id: doc(db, `events/${booking.eventId}`), // Reference to an event document
    user_id: doc(db, `users/${booking.userId}`), // Reference to a user document
    booking_date: Timestamp.fromDate(new Date(booking.booking_date)),
    number_of_places: booking.number_of_places,
    total_price: booking.total_price || null,
    status: booking.status
  });

  console.log(`Booking added with ID: ${bookingRef.id}`);
}

// Category
async function addCategory(category) {
  const categoryRef = await addDoc(collection(db, 'categories'), {
    name: category.name,
    description: category.description
  });

  console.log(`Category added with ID: ${categoryRef.id}`);
}



//App Layout
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Event />} />
        <Route path="/event-details" element={<EventDetails />} />
        <Route path="/events-list-admin-view" element={<EventListAdminView />} />  
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
