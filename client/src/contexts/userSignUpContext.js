import { createContext, useState } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const UserSignUpContext = createContext();

export const UserSignUpProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${apiUrl}/users/signup`, userData, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during signup"
      );
      console.error(`Error signing up user: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserSignUpContext.Provider value={{ user, loading, error, signup }}>
      {children}
    </UserSignUpContext.Provider>
  );
};
