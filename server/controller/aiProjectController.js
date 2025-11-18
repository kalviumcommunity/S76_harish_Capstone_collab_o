require('dotenv').config({ path: './config/.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

let fetchPolyfill = null;
try {
  fetchPolyfill = require('node-fetch');
  fetchPolyfill = fetchPolyfill.default || fetchPolyfill;
} catch (err) {
  fetchPolyfill = null;
}

const getFetch = () => {
  if (typeof fetch === 'function') return fetch;
  if (fetchPolyfill) return fetchPolyfill;
  throw new Error('Fetch API is not available.');
};

const extractJson = (text) => {
  if (!text) throw new Error('Empty response from AI.');
  
  const trimmed = text.trim();
  
  // Try to extract from markdown code block
  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return JSON.parse(fencedMatch[1]);
  }
  
  // Try to find JSON object
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  // Try direct parse
  return JSON.parse(trimmed);
};

const callGemini = async (prompt) => {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured.');
  
  const fetchFn = getFetch();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${PRIMARY_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      responseMimeType: 'text/plain',
    },
  };

  const response = await fetchFn(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  
  if (!response.ok) {
    const message = payload?.error?.message || `AI request failed with status ${response.status}`;
    throw new Error(message);
  }

  const parts = payload?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((part) => part?.text || '').join('').trim();
  
  if (!text) throw new Error('AI returned empty response.');
  
  return text;
};

const generateProjectDetails = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Please provide a more detailed project description (at least 10 characters).' 
      });
    }

    const prompt = `
You are an expert project manager and technical consultant. A client has provided this project idea:

"${description}"

Generate a comprehensive project specification in JSON format with the following structure:

{
  "title": "Catchy project title (max 80 chars)",
  "detailedDescription": "Comprehensive 3-4 paragraph description covering what, why, and expected outcomes",
  "category": "One of: Web Development, Mobile Apps, UI/UX Design, Content Writing, Digital Marketing, Graphic Design, Data Science, DevOps, Blockchain, AI/ML",
  "budget": {
    "min": "minimum budget in USD (number)",
    "max": "maximum budget in USD (number)",
    "reasoning": "1-2 sentence explanation of budget range"
  },
  "timeline": {
    "estimated": "estimated completion time (e.g., '4-6 weeks', '2-3 months')",
    "reasoning": "brief explanation of timeline"
  },
  "technicalRequirements": {
    "frontend": ["list of frontend technologies if applicable"],
    "backend": ["list of backend technologies if applicable"],
    "database": ["database technologies if applicable"],
    "apis": ["external APIs or services needed"],
    "infrastructure": ["hosting, deployment, CI/CD needs"],
    "other": ["any other technical requirements"]
  },
  "features": [
    "List of key features and functionalities (8-12 features)"
  ],
  "milestones": [
    {
      "phase": "Phase name (e.g., 'Planning & Design')",
      "deliverables": ["list of deliverables for this phase"],
      "duration": "time estimate for this phase"
    }
  ],
  "skillsRequired": [
    "List of skills/expertise needed (8-15 skills)"
  ],
  "deliverables": [
    "Final deliverables the client will receive"
  ],
  "successCriteria": [
    "Measurable success criteria for the project"
  ]
}

Important:
- Be specific and realistic
- Budget should reflect actual market rates
- Timeline should be achievable
- Technical requirements should be modern and appropriate
- Skills should be relevant to the actual work needed
- Return ONLY valid JSON, no additional text
`;

    const aiResponse = await callGemini(prompt);
    const projectDetails = extractJson(aiResponse);
    
    // Validate required fields
    if (!projectDetails.title || !projectDetails.detailedDescription || !projectDetails.category) {
      throw new Error('AI response missing required fields.');
    }

    res.json({
      success: true,
      data: projectDetails
    });

  } catch (err) {
    console.error('AI Project Generation Error:', err);
    res.status(500).json({ 
      error: 'Failed to generate project details',
      message: err.message 
    });
  }
};

const enhanceProjectDescription = async (req, res) => {
  try {
    const { briefDescription } = req.body;
    
    if (!briefDescription || briefDescription.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Please provide a brief description (at least 10 characters).' 
      });
    }

    const prompt = `
Expand this brief project description into a comprehensive, professional project description:

"${briefDescription}"

Return ONLY a well-structured, detailed description (200-300 words) that includes:
- What the project is
- Key objectives and goals
- Expected outcomes
- Target audience or users
- Why this project is valuable

Write in professional but accessible language. Do not include any JSON or formatting markers.
`;

    const enhancedDescription = await callGemini(prompt);
    
    res.json({
      success: true,
      enhancedDescription: enhancedDescription.trim()
    });

  } catch (err) {
    console.error('Description Enhancement Error:', err);
    res.status(500).json({ 
      error: 'Failed to enhance description',
      message: err.message 
    });
  }
};

module.exports = {
  generateProjectDetails,
  enhanceProjectDescription
};
