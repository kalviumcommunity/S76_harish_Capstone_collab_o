const express = require('express');
const router = express.Router();
const { generateQuizFromPrompt, saveSkillAssessment } = require('../controller/QuizAiController');
const authenticate = require('../middleware/AuthMiddleWare');

router.post('/generate', generateQuizFromPrompt);
router.post('/save-assessment', authenticate, saveSkillAssessment);

module.exports = router;