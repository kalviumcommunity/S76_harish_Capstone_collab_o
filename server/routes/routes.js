const express = require('express');
const router = express.Router();
const { createProject, getAllProjects , updateProject } = require('../controller/ItemController');
const authController = require('../controller/auth');


router.put('/update/:id', updateProject);
router.post('/create', createProject);
router.get('/', getAllProjects);


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);



module.exports = router;
