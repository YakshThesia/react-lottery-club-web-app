// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASxLYktuiz9W8Df2dkEZa450Idmhs7bQ8",
  authDomain: "lottery-club-9ecc0.firebaseapp.com",
  projectId: "lottery-club-9ecc0",
  storageBucket: "lottery-club-9ecc0.firebasestorage.app",
  messagingSenderId: "302799852232",
  appId: "1:302799852232:web:64248cc724c3573342cbfd",
};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(firebaseApp);  // Auth instance
export const db = getFirestore(firebaseApp); // Firestore instance

export default firebaseApp;
