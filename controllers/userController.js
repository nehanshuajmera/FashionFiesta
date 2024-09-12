import mongoose from "mongoose";
import { User } from "../models/userModel.js";

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

/* create a user */
export const createUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const createUser = await User.create({ userName, email, password });
    res.status(201).json(createUser);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* update a user */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { userName, email, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "No user with that id" });
  }

  const updateUser = { userName, email, password, _id: id };
  const newUser = await User.findByIdAndUpdate(id, updateUser, { new: true });

  if (!newUser) {
    res.status(404).json({ message: "No user with that id" });
  }
  res.status(200).json(newUser);
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
