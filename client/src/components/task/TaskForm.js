import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../../store/slices/taskSlice";
import Card from "../ui/Card";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import Label from "../ui/Label";

const TaskForm = ({ user = null, task = null, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});

  // If task prop exists, populate form for editing
  useEffect(() => {
    if (task) {
      const formattedDate = task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "";

      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: formattedDate,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user modifies it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    // Prepare payload
    const isoDueDate = new Date(formData.dueDate).toISOString();
    const userId = task?.user || user._id || user.id;
    
    const payload = {
      ...formData,
      dueDate: isoDueDate,
      user: userId
    };
    
    try {
      if (task) {
        // For updating existing task
        await dispatch(updateTask({ 
          id: task._id, 
          updates: payload 
        })).unwrap();
      } else {
        // For creating new task
        await dispatch(addTask(payload)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Task submission error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save task. Please try again.",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card
        className="w-full max-w-md animate-fadeIn"
        padding="normal"
        elevation="high"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="mb-4">
            <Label text="Title" id="title" />
            <TextInput
              id="title"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <Label text="Description" id="description" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className={`w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg 
                ring-offset-1 focus:ring-2 focus:ring-blue-500 
                hover:border-blue-400 border 
                ${errors.description ? "border-red-500" : "border-gray-300"}
                focus:border-transparent focus:outline-none placeholder:text-gray-400 shadow-sm transition-all`}
              rows="3"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Due Date Field */}
          <div className="mb-4">
            <Label text="Due Date" id="dueDate" />
            <TextInput
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={onClose} variant="secondary" size="medium">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="medium">
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TaskForm;