
const { generateCourse } = require('../services/geminiService');

const generateCourseFromPrompt = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const course = await generateCourse(prompt);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Course generation failed' });
  }
};

module.exports = { generateCourseFromPrompt };
