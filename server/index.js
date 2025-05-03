const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Load environment variables
dotenv.config();

// MongoDB connection
connectDB();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

try {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running..." });
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Define Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/tasks", taskRoutes); 

  // Error handling middleware
  app.use(notFound); // Handle 404 errors
  app.use(errorHandler); // Handle other errors
} catch (error) {
  console.error("Error starting server:", error);
  process.exit(1); // Exit the process with failure
}
