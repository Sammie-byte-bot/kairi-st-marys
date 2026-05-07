now i like how we have reasoned out now i want you to edit the two portals to fetch data from the new collections and documents also i want all the export and downloads  buttons to work and also the button to add a student in the teachers portal i want it to open a model which is well styled where the teacher will be able to add the student details as we have structured the users  collection also i want when the student is  added he / she is also to access the portal himself also make everything to be fetched from the fire store and no hard coded info . the fire base configurations are in the firebase-config.js folder so let it be gotten from there and there it is 

```javascript
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

```