// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import for Firebase Authentication
import { getStorage } from "firebase/storage"; // Import for Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPMdDaVgCHwjlpjzaljnzTB7RuOFnO7L4",
  authDomain: "k6002-2b4cf.firebaseapp.com",
  projectId: "k6002-2b4cf",
  storageBucket: "gs://k6002-2b4cf.firebasestorage.app",
  messagingSenderId: "377107045296",
  appId: "1:377107045296:web:2be5984ec8bbb736265475",
  measurementId: "G-4QMSHTY8LW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firestore and Authentication
export const db = getFirestore(app);
export const auth = getAuth(app); // Export Auth instance

// Initialize Storage
export const storage = getStorage(app);

export default app;
