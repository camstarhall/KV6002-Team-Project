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
