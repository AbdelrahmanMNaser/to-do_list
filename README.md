# TaskMaster - To-Do List Application

A full-stack to-do list application built with MERN stack. This application offers task management features with interactive dashboards, task filtering, and user authentication. It follows MVC architecture and is designed to be responsive and user-friendly.


## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Set up the backend](#2-set-up-the-backend)
  - [3. Set up the frontend](#3-set-up-the-frontend)
- [Running the Application](#running-the-application)
- [1. Start the backend server](#1-start-the-backend-server)
- [2. Start the frontend application](#2-start-the-frontend-application)
- [License](#license)

## Features

- **User Authentication**: Register and login functionality
- **Dashboard**: Overview of task statistics with charts
- **Task Management**:
  - Create, read, update, and delete tasks
  - Filter tasks by status
  - Search tasks by title
  - View task details
- **User Profile**: Update user information and change password
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS

## Tech Stack

### Frontend
- React
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Plotly.js for charts and visualizations

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (local instance or MongoDB Atlas)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd to-do_list
```

### 2. Set up the backend

```bash
cd server

# Install dependencies
npm install

# Create a .env file
```

Create a .env file in the server directory with the following content:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/to-do_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=30d
```

> Note: For production, use a strong random string for JWT_SECRET

### 3. Set up the frontend

```bash
cd ../client

# Install dependencies
npm install

# Create a .env file
```

Create a .env file in the client directory with the following content:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

### 1. Start the backend server

```bash
cd server
npm run dev
```

The server will start on port 5000 by default.

### 2. Start the frontend application

```bash
cd client
npm start
```

The React application will start on port 3000 and should automatically open in your browser.



## License

MIT License. See [LICENSE](LICENSE) for details.