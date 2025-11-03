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
router.get('/', authenticate, getAllProjects); // Get all projects (secured)
router.delete('/delete/:id', authenticate, deleteProject); // Delete project (secured with owner check)
router.get('/user/:userId', getProjectsByUser);// Get projects by user (secured)

router.get('/:id', getProjectById);

module.exports = router;