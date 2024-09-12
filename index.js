import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
config();

/* importing routes */ 
import { userRoutes } from "./routes/userRoute.js";

const PORT = process.env.PORT;

const app = express();

// CORS options based on environment
const corsOptions = {
  origin: ["http://localhost:3000"], // Array of origins
  credentials: true, // Allow credentials such as cookies to be sent
};

/* middleware */
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

/* routes */
app.get("/", (req, res) => {
  res.status(200).json("Backend Working, Happy Coding!!");
});
app.use("/api/users", userRoutes);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MDB_CONNECT);
    console.log(`Connect to MongoDB`);

    app.listen(PORT, () => {
      console.log(`App is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`Error Connecting to MongoDB: ${err.message}`);
    throw new Error(`Error connecting to the database: ${err.message}`);
  }
};

connect();

/* Error Handling middleware */
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
