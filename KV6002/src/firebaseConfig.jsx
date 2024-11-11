// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPMdDaVgCHwjlpjzaljnzTB7RuOFnO7L4",
  authDomain: "k6002-2b4cf.firebaseapp.com",
  projectId: "k6002-2b4cf",
  storageBucket: "k6002-2b4cf.appspot.com",
  messagingSenderId: "377107045296",
  appId: "1:377107045296:web:2be5984ec8bbb736265475",
  measurementId: "G-4QMSHTY8LW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;
