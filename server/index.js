const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');   
const cors = require('cors');
const dotenv = require('dotenv');

const authMiddleware = require('./middleware/authMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const connectDB = require('./config/db'); 

const authRoutes = require('./routes/authRoutes');




const app = express();

// Load environment variables
dotenv.config(); 

// MongoDB connection
connectDB();

const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies


try {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running...' });
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Define Routes
  app.use('/api/auth', authRoutes);

  // Error handling middleware
  app.use(notFound); // Handle 404 errors
  app.use(errorHandler); // Handle other errors

}  

catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit the process with failure
  }


// 