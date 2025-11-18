const express = require('express');
const router = express.Router();
const { generateProjectDetails, enhanceProjectDescription } = require('../controller/aiProjectController');
const authenticate = require('../middleware/AuthMiddleWare');

// Generate full project details from brief description
router.post('/generate-project', authenticate, generateProjectDetails);

// Enhance a brief description into detailed one
router.post('/enhance-description', authenticate, enhanceProjectDescription);

module.exports = router;
