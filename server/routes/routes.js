const express = require('express');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    updateProject,
    getProjectsByUser,
} = require('../controllers/ProjectController');
const authController = require('../controllers/auth'); // Import auth controller
const authenticate = require('../middleware/AuthMiddleware'); // Import authentication middleware

// Authentication Routes
router.post('/signup', authController.signup); // User signup
router.post('/login', authController.login);   // User login

// Project Routes
router.post('/create', authenticate, createProject); // Create a project (secured)
router.put('/update/:id', authenticate, updateProject); // Update a project (secured)
router.get('/', authenticate, getAllProjects); // Get all projects (secured)
router.get('/user/:userId', authenticate, getProjectsByUser); // Get projects by user (secured)

module.exports = router;