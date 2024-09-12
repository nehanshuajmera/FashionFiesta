import express from "express";
const router = express.Router();
import {
  userSignup,
  userLogin,
  logout,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { userAuth } from "../middlewares/userAuth.js";

/* user signup */
router.post("/signup", userSignup);

/* user login */
router.post("/login", userLogin);

/* user logout */ 
router.get("/logout", userAuth, logout);

/* get all users api */
router.get("/", getAllUsers);

/* get single user api */
router.get("/:id", getSingleUser);

/* update a user api */
router.patch("/:id", updateUser);

/* delete a user api */
router.delete("/:id", deleteUser);

export const userRoutes = router;
