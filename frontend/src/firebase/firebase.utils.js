// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // For Firestore database (optional)

const firebaseConfig = {
  apiKey: "AIzaSyDwQkehzHaqoQn8CEDAo63CIUOmJ7qjp_0",
  authDomain: "fashion-fiesta-f3afa.firebaseapp.com",
  projectId: "fashion-fiesta-f3afa",
  storageBucket: "fashion-fiesta-f3afa.appspot.com",
  messagingSenderId: "170766499606",
  appId: "1:170766499606:web:faa2fcba0b27fd26d09a37",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services you want to use
const auth = getAuth(app); // For authentication
const db = getFirestore(app); // For Firestore database (optional)
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
