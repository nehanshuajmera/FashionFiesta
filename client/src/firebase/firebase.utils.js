// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // For Firestore database (optional)

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
const provider = new GoogleAuthProvider();

// Function to create or update a user document in Firestore
export const createUserDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid); // Reference to the user document
  const userSnapshot = await getDoc(userDocRef); // Fetch user document snapshot

  // If the user does not exist, create a new document
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (err) {
      console.error(`Error creating the user document: ${err.message}`);
    }
  }

  return userDocRef;
};

// Retrieving User Data
export const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data(); // Return user data
    } else {
      console.error("No user document found");
      return null;
    }
  } catch (err) {
    console.error(`Error fetching user document: ${err.message}`);
    return null;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create or update the user document in Firestore
    await createUserDocument(user);
  } catch (err) {
    console.error(`Error during Sign-in: ${err.message}`);
  }
};

// Sign Out
export const signOutUser = () => signOut(auth);

// Listen to user state
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
