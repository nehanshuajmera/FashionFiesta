import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/homepage/homepage.component";
import { ShopPage } from "./pages/shop/shop.component";
import { Header } from "./universal/header/header.component";
import { SignInAndSignUpPage } from "./pages/sign-in-and-sign-up-page/sign-in-and-sign-up.component";
import {
  onAuthStateChangedListener,
  signOutUser,
  getUserDocument,
} from "./firebase/firebase.utils";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      try {
        setCurrentUser(user);

        if (user) {
          // Fetch user data from Firestore
          const userDoc = await getUserDocument(user.uid);
          setUserData(userDoc);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p> // Display loading message
      ) : (
        <>
          <Header currentUser={currentUser} onSignOut={signOutUser} />
          <div className="pages">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/signin" element={<SignInAndSignUpPage />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
