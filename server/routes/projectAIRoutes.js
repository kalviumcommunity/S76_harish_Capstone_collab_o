const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthMiddleWare');
const { generateProjectDescription } = require('../controller/projectAIController');

// Route to generate project description using AI
router.post('/generate-description', auth, generateProjectDescription);

module.exports = router;