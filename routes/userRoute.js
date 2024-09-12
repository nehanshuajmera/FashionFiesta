import express from "express";
const router = express.Router();
import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

/* get all users api */
router.get("/", getAllUsers);

/* get single user api */
router.get("/:id", getSingleUser);

/* create a user api */
router.post("/", createUser);

/* update a user api */
router.patch("/:id", updateUser);

/* delete a user api */
router.delete("/:id", deleteUser);

export const userRoutes = router;
