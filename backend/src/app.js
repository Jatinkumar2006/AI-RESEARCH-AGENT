import express from "express";
import cors from "cors";
import researchRoutes from "./routes/researchRoutes.js";

const app = express();


// #MIDDLEWARE SETUP

// Allow frontend to access backend (important for React)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());


// #ROUTES

// All research-related endpoints will start with /api
app.use("/api", researchRoutes);


// #GLOBAL ERROR HANDLER
// If something unexpected breaks, this catches it
app.use((err, req, res, next) => {
  console.error("Unexpected Error:", err.message);
  res.status(500).json({
    success: false,
    error: "Something went wrong",
  });
});


export default app;