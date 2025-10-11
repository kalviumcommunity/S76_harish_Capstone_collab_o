const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCourse(prompt) {
  try {
    console.log('🚀 Generating course with Gemini 2.0 Flash for prompt:', prompt);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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

    console.log('📤 Sending request to Gemini 2.0 Flash...');
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: formattedPrompt }] }] });
    const response = await result.response;
    const text = response.text();

    console.log('📥 Received response from Gemini');

    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;
      const parsedCourse = JSON.parse(jsonString);
      console.log('✅ Successfully parsed course JSON');
      return parsedCourse;
    } catch (err) {
      console.error('❌ Failed to parse Gemini JSON response:', err);
      console.error('Raw response:', text);
      throw new Error('Failed to parse Gemini JSON response');
    }
  } catch (error) {
    console.error('❌ Error in generateCourse:', error);
    throw error;
  }
}

module.exports = { generateCourse };
