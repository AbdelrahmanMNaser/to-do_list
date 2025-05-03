const Task = require("../models/taskModel");
const User = require("../models/userModel");

/* <---------------------------- GET APIs --------------------------> */

// @desc   Get all tasks for a user
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.id }).populate({
      path: "user",
      select: "name email",
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate({
      path: "user",
      select: "name email",
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* <---------------------------- POST APIs --------------------------> */

// @desc   Create a new task
const createTask = async (req, res) => {
  const { title, description, status, userId } = req.body;
  const task = new Task({ title, description, status, userId });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ---------------------------- PUT APIs --------------------------> */

// @desc   Update task by ID
const updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
    }).populate({
      path: "user",
      select: "name email",
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update task status by ID
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ---------------------------- DELETE APIs --------------------------> */

// @desc   Delete task by ID
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*---------------------------- EXPORTS --------------------------> */

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
