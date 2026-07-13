// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJBtwPHBMuM9Ijo2A028cuXOJIsqD8PHc",
  authDomain: "conceptualbridge-a8f75.firebaseapp.com",
  projectId: "conceptualbridge-a8f75",
  storageBucket: "conceptualbridge-a8f75.firebasestorage.app",
  messagingSenderId: "294946493963",
  appId: "1:294946493963:web:d302103ff0f3e3359b990e",
  measurementId: "G-T7QZEQ941T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Export
export { auth };
