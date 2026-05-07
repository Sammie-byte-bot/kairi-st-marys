// firebase-config.js
// Replace the values below with your actual Firebase project config
// Get them from: Firebase Console → Project Settings → Your Apps → SDK setup

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB04w9bPdE7cpoBUVRWcmG_SNQiL6cB3RY",
  authDomain: "kairi-st-mary-s.firebaseapp.com",
  projectId: "kairi-st-mary-s",
  storageBucket: "kairi-st-mary-s.firebasestorage.app",
  messagingSenderId: "903898779898",
  appId: "1:903898779898:web:8edda07fc67c5b98947943",
  measurementId: "G-8GPY6EW0V9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
