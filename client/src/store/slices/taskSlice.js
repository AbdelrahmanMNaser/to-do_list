import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tasks`, { params: { userId } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasks', task);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  tasks: [],
  status: 'idle', 
  error: null,
  filters: {
    status: 'all', 
    priority: 'all',
    search: ''
  },
  sort: {
    field: 'dueDate', 
    direction: 'asc'
  }
};

// Create the slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Filter reducers
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.filters.search = action.payload;
    },
    // Sort reducers
    setSortField: (state, action) => {
      state.sort.field = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sort.direction = action.payload;
    },
    // Reset filters/sorting
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    // Local updates before API call (for optimistic UI)
    markAsCompleted: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) task.status = 'completed';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        } else {
          state.tasks.push(action.payload);
        }
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add task
      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;        
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setStatusFilter,
  setPriorityFilter,
  setSearchTerm,
  setSortField,
  setSortDirection,
  resetFilters,
  markAsCompleted
} = taskSlice.actions;

export const selectFilteredTasks = state => {
  const { tasks, filters, sort } = state.tasks;
  
  return tasks
    .filter(task => {
      // Apply status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      
      // Apply priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      
      // Apply search filter
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      const field = sort.field;
      const direction = sort.direction === 'asc' ? 1 : -1;
      
      if (a[field] < b[field]) return -1 * direction;
      if (a[field] > b[field]) return 1 * direction;
      return 0;
    });
};

export const selectUpcomingTasks = state => {
  const today = new Date();
  return state.tasks.tasks
    .filter(task => 
      task.status === 'pending' && new Date(task.dueDate) >= today
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5); // Get the 5 most upcoming tasks
};

export default taskSlice.reducer;