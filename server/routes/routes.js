const express = require('express');
const router = express.Router();
const projectController = require('../controller/ItemController');


router.post('/post', projectController.createProject);

module.exports = router;