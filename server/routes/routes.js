const express = require('express');
const router = express.Router();
const { createProject, getAllProjects , updateProject } = require('../controller/ItemController');


router.put('/update/:id', updateProject);
router.post('/create', createProject);
router.get('/', getAllProjects);

module.exports = router;
