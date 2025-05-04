import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Add this import
import { updateTask, deleteTask, fetchTasks } from "../../store/slices/taskSlice";
import Card from "../ui/Card";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaClock,
  FaCalendarAlt,
  FaRegCircle,
} from "react-icons/fa";

const TaskCard = ({ task, onEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate if task is overdue
  const isOverdue =
    task.status === "pending" && new Date(task.dueDate) < new Date();

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle status toggle (complete/incomplete)
  const handleToggleStatus = async (e) => {
    // Stop propagation to prevent navigation when toggling status
    
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await dispatch(
      updateTask({
        id: task._id,
        updates: {
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date() : null,
        },
      })
    );
  };

  // Handle delete task
  const handleDelete = (e) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(task._id));
    }
  };

  // Create a URL-friendly slug from the title
  const createSlug = (title) => {
    // Store task ID in the slug to fetch data later
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${task._id}`;
  };

  const handleCardClick = () => {
    navigate(`/tasks/${createSlug(task.title)}`);
  };

  // Handle edit with preventing navigation
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <Card
      variant="interactive"
      padding="normal"
      onClick={handleCardClick}
      className={`mb-4 hover:shadow-md transition-all cursor-pointer ${
        isOverdue
          ? "border-l-4 border-l-red-400"
          : task.status === "completed"
          ? "border-l-4 border-l-green-400"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox for status toggle */}
        <button
          onClick={handleToggleStatus}
          className={`mt-1 p-1.5 rounded-full flex-shrink-0 transition-colors ${
            task.status === "completed"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          }`}
          title={
            task.status === "completed"
              ? "Mark as Pending"
              : "Mark as Completed"
          }
        >
          {task.status === "completed" ? <FaCheck /> : <FaRegCircle />}
        </button>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            {/* Title */}
            <h3
              className={`font-semibold text-lg ${
                task.status === "completed" ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </h3>

            {/* Edit/Delete buttons */}
            <div className="flex gap-2 ml-2">
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-amber-600 transition-colors"
                title="Edit Task"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors"
                title="Delete Task"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          {/* Status indicators and dates */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {/* Status pill */}
            <span
              className={`px-2 py-0.5 rounded-full font-medium ${
                task.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : isOverdue
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {task.status === "completed"
                ? "Completed"
                : isOverdue
                ? "Overdue"
                : "Pending"}
            </span>

            {/* Due date */}
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                Due: {formatDate(task.dueDate)}
              </span>
            </div>

            {/* Created at */}
            <div className="flex items-center">
              <FaClock className="mr-1" />
              Created: {formatDate(task.createdAt)}
            </div>

            {/* Completed at (if applicable) */}
            {task.status === "completed" && task.completedAt && (
              <div className="flex items-center text-green-600">
                <FaCheck className="mr-1" />
                Completed: {formatDate(task.completedAt)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;