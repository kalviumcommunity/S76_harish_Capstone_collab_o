const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCourse(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const formattedPrompt = `
  Create a structured online course for: "${prompt}".
  Return JSON with:
  - courseTitle
  - description
  - lessons (each with title, summary, topics[])

  Format it exactly as JSON:
  {
    "courseTitle": "...",
    "description": "...",
    "lessons": [
      {
        "title": "...",
        "summary": "...",
        "topics": ["...", "..."]
      }
    ]
  }
  `;

  const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: formattedPrompt }] }] });
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Failed to parse Gemini JSON');
  }
}

module.exports = { generateCourse };
