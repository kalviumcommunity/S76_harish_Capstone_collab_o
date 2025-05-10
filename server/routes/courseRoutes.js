// routes/courseAIRoutes.js
const express = require('express');
const router = express.Router();
const { generateCourseFromPrompt } = require('../controller/courseAIController');

router.post('/generate', generateCourseFromPrompt);

module.exports = router;
