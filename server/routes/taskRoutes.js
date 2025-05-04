const express = require("express");

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Middleware to protect routes
const protect = require("../middlewares/authMiddleware");

// Create a new router instance
const router = express.Router();

// Protect all task routes
router.use(protect);

// POST APIs
router.post("/", createTask);

// GET APIs
router.get("/", getAllTasks);
router.get("/:id", getTaskById);

// PUT APIs
router.patch("/:id", updateTask);

// DELETE APIs
router.delete("/:id", deleteTask);

module.exports = router;
