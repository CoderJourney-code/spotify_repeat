// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDM3r_oZFiYY3fiy1NZEIuHO5-nyt5W034",
  authDomain: "spotifydatabase-3810b.firebaseapp.com",
  projectId: "spotifydatabase-3810b",
  storageBucket: "spotifydatabase-3810b.appspot.com",
  messagingSenderId: "293658035348",
  appId: "1:293658035348:web:f466423c33fac4f1266081",
  measurementId: "G-02ZWC1PJ1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
// const analytics = getAnalytics(app);

onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in
        console.log("User is signed in")
    } else {
        // User is signed out
        console.log("User is signed out")
    }
});