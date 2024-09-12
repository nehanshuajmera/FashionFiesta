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

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getUserDocument(user.uid);
        setUserData(userDoc);
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="App">
      <Header currentUser={currentUser} onSignOut={signOutUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/signin" element={<SignInAndSignUpPage />} />
      </Routes>
    </div>
  );
};

export default App;
