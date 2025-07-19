const { GoogleGenerativeAI } = require('@google/generative-ai');
const Profile = require('../model/Profile');
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

async function saveSkillAssessment(req, res) {
  const { skill, score, totalQuestions, difficulty } = req.body;
  
  if (!skill || score === undefined || !totalQuestions || !difficulty) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Calculate percentage and determine status
    const percentage = Math.round((score / totalQuestions) * 100);
    let status;
    
    if (percentage >= 90) status = 'Expert';
    else if (percentage >= 75) status = 'Advanced';
    else if (percentage >= 60) status = 'Intermediate';
    else status = 'Beginner';

    // Find or create profile
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId, skillAssessments: [] });
    }

    // Check if skill assessment already exists
    const existingAssessmentIndex = profile.skillAssessments.findIndex(
      assessment => assessment.skill.toLowerCase() === skill.toLowerCase()
    );

    const newAssessment = {
      skill,
      score,
      totalQuestions,
      difficulty,
      percentage,
      status,
      completedAt: new Date()
    };

    if (existingAssessmentIndex >= 0) {
      // Update existing assessment if new score is better
      const existingAssessment = profile.skillAssessments[existingAssessmentIndex];
      if (percentage > existingAssessment.percentage) {
        profile.skillAssessments[existingAssessmentIndex] = newAssessment;
      }
    } else {
      // Add new assessment
      profile.skillAssessments.push(newAssessment);
      
      // Add skill to skills array if not already present
      if (!profile.skills.includes(skill)) {
        profile.skills.push(skill);
      }
    }

    await profile.save();

    console.log('Skill assessment saved:', {
      userId,
      skill,
      percentage,
      status,
      profileId: profile._id
    });

    res.json({ 
      message: 'Skill assessment saved successfully',
      assessment: newAssessment
    });
  } catch (error) {
    console.error('Error saving skill assessment:', error);
    res.status(500).json({ error: 'Failed to save skill assessment' });
  }
}

module.exports = { generateQuizFromPrompt, saveSkillAssessment };