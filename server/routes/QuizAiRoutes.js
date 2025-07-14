const express = require('express');
const router = express.Router();
const { generateQuizFromPrompt } = require('../controller/QuizAiController');

router.post('/generate', generateQuizFromPrompt);

module.exports = router;