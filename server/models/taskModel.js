const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedAt: {
      default: null,
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
