// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import AdminDashboard from "./components/AdminDashboard";
import LeaderDashboard from "./components/LeaderDashboard";
import UserDashboard from "./components/UserDashboard";
import ResetPassword from "./components/ResetPassword";
import Feedback from "./components/Feedback";
import LogoutButton from "./components/LogoutButton";
import ProtectedRoute from "./components/ProtectedRoute";
import RSVPReport from "./components/RSVPReport";

// NOT RELEVANT FOR NOW

//Firebase:
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// // Your web app's Firebase configuration

// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {

//   apiKey: "AIzaSyBPMdDaVgCHwjlpjzaljnzTB7RuOFnO7L4",

//   authDomain: "k6002-2b4cf.firebaseapp.com",

//   projectId: "k6002-2b4cf",

//   storageBucket: "k6002-2b4cf.appspot.com",

//   messagingSenderId: "377107045296",

//   appId: "1:377107045296:web:2be5984ec8bbb736265475",

//   measurementId: "G-4QMSHTY8LW"

// };

// // Initialize Firebase

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// //DB Structure

// //User
// async function addUser(user) {
//   const userRef = await addDoc(collection(db, 'users'), {
//     name: user.name,
//     email: user.email,
//     password: user.password,
//     phone_number: user.phone_number,
//     user_type: user.user_type, // "admin" or "endUser"
//     date_joined: Timestamp.fromDate(new Date(user.date_joined))
//   });

//   if (user.user_type === 'admin') {
//     // Add admin sub-collection
//     await setDoc(doc(db, `users/${userRef.id}/admin`, 'details'), {
//       role: user.role,
//       permissions: user.permissions,
//       created_events: user.created_events || []
//     });
//   } else if (user.user_type === 'endUser') {
//     // Add endUser sub-collection
//     await setDoc(doc(db, `users/${userRef.id}/endUser`, 'details'), {
//       booking_history: user.booking_history || [],
//       favorites: user.favorites || [],
//       preferences: user.preferences || {}
//     });
//   }

//   console.log(`User added with ID: ${userRef.id}`);
// }

// // Event Document
// async function addEvent(event) {
//   const eventRef = await addDoc(collection(db, 'events'), {
//     name: event.name,
//     description: event.description,
//     date_time: Timestamp.fromDate(new Date(event.date_time)),
//     location: doc(db, `venues/${event.locationId}`), // Reference to a venue document
//     category: doc(db, `categories/${event.categoryId}`), // Reference to a category document
//     organiser_id: doc(db, `users/${event.organiserId}`), // Reference to an admin user document
//     capacity: event.capacity,
//     available_spots: event.available_spots,
//     price: event.price || null
//   });

//   console.log(`Event added with ID: ${eventRef.id}`);
// }

// // Venue
// async function addVenue(venue) {
//   const venueRef = await addDoc(collection(db, 'venues'), {
//     name: venue.name,
//     location: venue.location,
//     capacity: venue.capacity,
//     contact_info: venue.contact_info // Map containing phone, email, etc.
//   });

//   console.log(`Venue added with ID: ${venueRef.id}`);
// }

// //Booking
// async function addBooking(booking) {
//   const bookingRef = await addDoc(collection(db, 'bookings'), {
//     event_id: doc(db, `events/${booking.eventId}`), // Reference to an event document
//     user_id: doc(db, `users/${booking.userId}`), // Reference to a user document
//     booking_date: Timestamp.fromDate(new Date(booking.booking_date)),
//     number_of_places: booking.number_of_places,
//     total_price: booking.total_price || null,
//     status: booking.status
//   });

//   console.log(`Booking added with ID: ${bookingRef.id}`);
// }

// // Category
// async function addCategory(category) {
//   const categoryRef = await addDoc(collection(db, 'categories'), {
//     name: category.name,
//     description: category.description
//   });

//   console.log(`Category added with ID: ${categoryRef.id}`);
// }

//App Layout

function App() {
  return (
    <Router>
      <Header>
        <LogoutButton />
      </Header>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/events"
          element={<EventList />}
        />
        <Route
          path="/event-details"
          element={<EventDetails />}
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard/reports"
          element={<RSVPReport />}
        />{" "}
        {/* RSVPReport route */}
        <Route
          path="/leader-dashboard"
          element={
            <ProtectedRoute role="localLeader">
              <LeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="normalUser">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/feedback"
          element={<Feedback />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
