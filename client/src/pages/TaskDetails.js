import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTaskById } from "../store/slices/taskSlice";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaCheck, FaTag } from "react-icons/fa";
import Button from "../components/ui/Button";

const TaskDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        const taskId = extractIdFromSlug(slug);
        if (!taskId) {
          setError("Invalid task identifier");
          setLoading(false);
          return;
        }
        
        const response = await dispatch(fetchTaskById(taskId)).unwrap();
        setTask(response);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load task");
        setLoading(false);
      }
    };
    
    loadTask();
  }, [dispatch, slug]);

  // Helper function to extract ID from slug
  const extractIdFromSlug = (slug) => {
    const lastHyphenIndex = slug.lastIndexOf('-');
    if (lastHyphenIndex !== -1) {      
      return slug.substring(lastHyphenIndex + 1);
    }
    return null;
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate if task is overdue
  const isOverdue = task && 
    task.status === "pending" && 
    new Date(task.dueDate) < new Date();

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading task information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
        <h3 className="text-lg font-medium">Error loading task</h3>
        <p>{error}</p>
        <Button variant="secondary" onClick={handleBack} className="mt-2">
          <FaArrowLeft className="mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-amber-50 p-4 rounded-md text-amber-700 mb-4">
        <h3 className="text-lg font-medium">Task not found</h3>
        <p>The requested task could not be found.</p>
        <Button variant="secondary" onClick={handleBack} className="mt-2">
          <FaArrowLeft className="mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Simple header with back button */}
      <div className={`px-6 py-4 border-b ${
        isOverdue ? "bg-red-50" : 
        task.status === "completed" ? "bg-green-50" : "bg-blue-50"
      }`}>
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <span
              className={`mt-2 inline-block px-3 py-1 rounded-full font-medium text-sm ${
                task.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : isOverdue
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {task.status === "completed"
                ? "Completed"
                : isOverdue
                ? "Overdue"
                : "Pending"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <div className="bg-gray-50 p-4 rounded-md min-h-[100px] whitespace-pre-wrap">
            {task.description || "No description provided."}
          </div>
        </div>
        
        {/* Timeline info */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h3 className="text-md font-medium mb-3 border-b pb-2">Timeline</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className={`font-medium ${isOverdue ? "text-red-600" : ""}`}>
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaClock className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{formatDate(task.createdAt)}</p>
              </div>
            </div>
            
            {task.completedAt && (
              <div className="flex items-center">
                <FaCheck className="text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="font-medium text-green-700">
                    {formatDate(task.completedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tags section */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <FaTag className="text-gray-500 mr-2" />
              <h3 className="text-md font-medium">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;