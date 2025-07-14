const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuizFromPrompt(req, res) {
  const { topic, numQuestions = 30, difficulty = "Beginner" } = req.body;
  if (!topic) return res.status(400).json({ error: 'Quiz topic is required.' });

  const prompt = `
Generate a ${numQuestions}-question multiple choice quiz on "${topic}" at ${difficulty} level.
Return JSON with:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "..."
  }
]
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const response = await result.response;
    const text = response.text();

    let quiz;
    try {
      const match = text.match(/\[.*\]/s);
      quiz = match ? JSON.parse(match[0]) : JSON.parse(text);
    } catch {
      return res.status(500).json({ error: 'Failed to parse Gemini quiz JSON.' });
    }

    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Quiz generation failed.' });
  }
}

module.exports = { generateQuizFromPrompt };