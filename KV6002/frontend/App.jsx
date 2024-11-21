import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./public/Home";
import Login from "./public/Authentication/Login";
import Register from "./public/Register";
import EventList from "./public/Events/EventList";
import EventDetails from "./public/Events/EventDetails";
import AdminDashboard from "./private/Admin/AdminDashboard";
import LeaderDashboard from "./private/LocalLeader/LeaderDashboard";
import UserDashboard from "./private/Admin/UserDashboard";
import ResetPassword from "./public/Authentication/ResetPassword";
import Feedback from "./public/Feedback";
import LogoutButton from "./private/SharedFiles/LogoutButton";
import ProtectedRoute from "./ProtectedRoute";
import RSVPReport from "./private/SharedFiles/RSVPReport";

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
          path="/event/:id"
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
        />
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
