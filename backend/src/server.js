import dotenv from "dotenv";
import app from "./app.js";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;


// #START SERVER
const server = app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
});


// #HANDLE UNCAUGHT ERRORS
// If something crashes outside Express (like async bug), 
// this prevents silent shutdown.

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});