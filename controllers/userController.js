import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { decryptPassword } from "../decrypt.js";

/* Create Token */
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

/* user signup */
export const userSignup = async (req, res) => {
  const { displayName, userName, email, encryptedPassword } = req.body;

  try {
    // Decrypt the encrypted password
    const decryptedPassword = decryptPassword(encryptedPassword);6

    // Use decrypted password in the signup
    const user = await User.signup(displayName, userName, email, decryptedPassword);
    const token = createToken(user._id, "User");

    // Set the cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // Expires in 3 days
    });

    res.status(201).json({ user: user.userName, token });
  } catch (err) {
    console.error("Error signing up:", err.message); // Log error for debugging
    res.status(400).json({ error: err.message });
  }
};

/* user login */
export const userLogin = async (req, res) => {
  const { usernameOrEmail, encryptedPassword } = req.body;
  try {
    // Decrypt the encrypted password
    const decryptedPassword = decryptPassword(encryptedPassword);

    const user = await User.login(usernameOrEmail, decryptedPassword);
    const token = createToken(user._id, "User");

    // Set the cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // Expires in 3 days
    });

    res.status(200).json({ user: user.userName, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* user logout */
export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* get all users from db */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* get single user from db */
export const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "No user with that id" });
    }
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "No user with that id" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* update a user */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { displayName, userName, email, password } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "No user with that id" });
    }

    // Find the existing user in the database
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "No user with that id" });
    }

    // Update the user object
    const updateFields = {
      displayName: displayName || existingUser.displayName,
      userName: userName || existingUser.userName,
      email: email || existingUser.email,
    };

    // If password is provided, add it to the update fields
    if (password) {
      updateFields.password = password;
    }

    // Find and update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "No user with that id" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* delete a user */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "No user with that id" });
    }

    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      res.status(404).json({ message: "No user with that id" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
