const express = require('express');
const router = express.Router();
const { createProject } = require('../controller/ItemController');


router.post('/create', createProject);

module.exports = router;
