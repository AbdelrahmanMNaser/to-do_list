const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createUser, getUserById, getAllUsers, updateUser } = require('../controllers/userController');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// POST APIs
router.post('/', createUser);

// GET APIs
router.get('/:id', getUserById);
router.get('/', getAllUsers);

// PUT APIs
router.put('/:id', updateUser);


// Export the router
module.exports = router;
