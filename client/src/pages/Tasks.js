import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import {
  fetchTasks,
  setStatusFilter,
  setSearchTerm,
} from "../store/slices/taskSlice";

import TaskCard from "../components/task/TaskCard";
import TaskForm from "../components/task/TaskForm";
import Button from "../components/ui/Button";
import Input from "../components/ui/TextInput";

const Tasks = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const {
    tasks = [],
    status: loadingStatus,
    filters,
  } = useSelector((state) => state.tasks || {});

  const {user} = useSelector((state) => state.user);

  useEffect(() => {
    if (loadingStatus === "idle") {
      dispatch(fetchTasks());
    }
  }, [dispatch, loadingStatus]);

  // Handle form close
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Handle edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchInput));
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    dispatch(setSearchTerm(""));
  };

  // Filter tasks based on Redux filters
  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    if (filters.status !== "all" && task.status !== filters.status) {
      return false;
    }

    // Filter by search term
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Tasks</h1>

        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          size="medium"
          className="flex items-center"
        >
          <FaPlus className="mr-2 inline" /> New Task
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="font-medium mr-2">Status:</div>
          <div className="flex items-center">
            <input
              id="all-status"
              type="radio"
              name="status-filter"
              checked={filters.status === "all"}
              onChange={() => dispatch(setStatusFilter("all"))}
              className="mr-1"
            />
            <label htmlFor="all-status" className="text-sm mr-4">All</label>
          </div>
          <div className="flex items-center">
            <input
              id="pending-status"
              type="radio"
              name="status-filter"
              checked={filters.status === "pending"}
              onChange={() => dispatch(setStatusFilter("pending"))}
              className="mr-1"
            />
            <label htmlFor="pending-status" className="text-sm mr-4">Pending</label>
          </div>
          <div className="flex items-center">
            <input
              id="completed-status"
              type="radio"
              name="status-filter"
              checked={filters.status === "completed"}
              onChange={() => dispatch(setStatusFilter("completed"))}
              className="mr-1"
            />
            <label htmlFor="completed-status" className="text-sm">Completed</label>
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:w-1/3">
          <form onSubmit={handleSearch} className="relative">
            <Input
              id="searchTasks"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {searchInput ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              ) : (
                <button
                  type="submit"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaSearch />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Task List */}
      {loadingStatus === "loading" ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="flex flex-col gap-4 w-full">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={handleEditTask} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500">
            {filters.search ||
            filters.status !== "all"               
            ? "Try changing your filters or search term"
              : 'Click "New Task" to add your first task'}
          </p>
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && <TaskForm user={user} task={editingTask} onClose={handleCloseForm} />}
    </div>
  );
};

export default Tasks;
