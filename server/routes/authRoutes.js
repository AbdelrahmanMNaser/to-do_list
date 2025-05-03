const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// CREATE USER
router.post('/register', registerUser);

// LOGIN USER
router.post('/login', loginUser);


module.exports = router;