const express = require('express');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    updateProject,
    getProjectsByUser,
    deleteProject,
    getProjectById
} = require('../controller/ItemController');
const authController = require('../controller/auth'); 
const authenticate = require('../middleware/AuthMiddleWare'); 

router.post('/signup', authController.signup); 
router.post('/login', authController.login);   


router.post('/create', authenticate, createProject);
router.put('/update/:id', authenticate, updateProject);
router.get('/', getAllProjects); // Get all projects (public - no auth required)
router.delete('/delete/:id', authenticate, deleteProject); // Delete project (secured with owner check)
router.get('/user/:userId', getProjectsByUser);// Get projects by user (public)

router.get('/:id', getProjectById); // Get single project (public)

module.exports = router;