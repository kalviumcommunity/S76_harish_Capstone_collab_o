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

const generateProposal = async (req, res) => {
  try {
    const { 
      projectTitle,
      projectDescription,
      projectBudget,
      projectDeadline,
      freelancerName,
      freelancerSkills,
      freelancerExperience,
      existingProposal
    } = req.body;
    
    if (!projectTitle || !projectDescription) {
      return res.status(400).json({ 
        error: 'Project title and description are required.' 
      });
    }

    const mode = existingProposal ? 'improve' : 'generate';
    
    let prompt;
    
    if (mode === 'improve') {
      prompt = `
You are an expert proposal writer helping a freelancer improve their proposal.

Project Details:
Title: ${projectTitle}
Description: ${projectDescription}
Budget: ${projectBudget || 'Not specified'}
Deadline: ${projectDeadline || 'Not specified'}

Freelancer Profile:
Name: ${freelancerName || 'Freelancer'}
Skills: ${freelancerSkills || 'General skills'}
Experience: ${freelancerExperience || 'Experienced professional'}

Current Proposal:
${existingProposal}

Improve this proposal by making it more:
- Professional and persuasive
- Specific with clear deliverables
- Focused on client value
- Well-structured with proper sections

Return a JSON object with this structure:
{
  "coverLetter": "Improved professional cover letter addressing client needs (3-4 paragraphs)",
  "workPlan": [
    "Step-by-step work plan items (5-8 steps)"
  ],
  "timeline": {
    "totalDuration": "overall timeframe",
    "phases": [
      {
        "phase": "phase name",
        "duration": "time estimate",
        "deliverables": ["deliverable 1", "deliverable 2"]
      }
    ]
  },
  "pricing": {
    "suggested": "suggested price with reasoning",
    "breakdown": [
      {
        "item": "deliverable or service",
        "cost": "estimated cost"
      }
    ]
  },
  "relevantExperience": [
    "Portfolio items or experiences relevant to this project"
  ],
  "questionsForClient": [
    "3-5 clarifying questions to ask the client"
  ],
  "improvements": [
    "List of specific improvements made to the original proposal"
  ]
}

Return ONLY valid JSON, no additional text.
`;
    } else {
      prompt = `
You are an expert proposal writer helping a freelancer create a winning proposal.

Project Details:
Title: ${projectTitle}
Description: ${projectDescription}
Budget: ${projectBudget || 'Not specified'}
Deadline: ${projectDeadline || 'Not specified'}

Freelancer Profile:
Name: ${freelancerName || 'Freelancer'}
Skills: ${freelancerSkills || 'General skills'}
Experience: ${freelancerExperience || 'Experienced professional'}

Create a professional, persuasive proposal in JSON format:

{
  "coverLetter": "Professional cover letter addressing the client's needs, explaining why you're the best fit, and highlighting relevant experience (3-4 paragraphs, personalized and engaging)",
  "workPlan": [
    "Detailed step-by-step work plan (5-8 steps showing clear methodology)"
  ],
  "timeline": {
    "totalDuration": "realistic overall timeframe",
    "phases": [
      {
        "phase": "phase name (e.g., 'Discovery & Planning')",
        "duration": "time estimate",
        "deliverables": ["specific deliverable 1", "specific deliverable 2"]
      }
    ]
  },
  "pricing": {
    "suggested": "competitive price with clear justification",
    "breakdown": [
      {
        "item": "deliverable or service name",
        "cost": "estimated cost"
      }
    ],
    "notes": "pricing explanation or flexibility note"
  },
  "relevantExperience": [
    "3-4 relevant portfolio items or past experiences that match this project"
  ],
  "questionsForClient": [
    "3-5 intelligent questions to better understand requirements"
  ],
  "whyHireMe": [
    "3-4 compelling reasons why the client should hire you"
  ]
}

Make it:
- Professional but warm and personable
- Specific to the project requirements
- Value-focused (what client gets, not just what you'll do)
- Confident but not arrogant
- Include realistic timelines and pricing

Return ONLY valid JSON, no additional text.
`;
    }

    const aiResponse = await callGemini(prompt);
    const proposalData = extractJson(aiResponse);
    
    // Validate required fields
    if (!proposalData.coverLetter || !proposalData.workPlan) {
      throw new Error('AI response missing required fields.');
    }

    res.json({
      success: true,
      mode,
      data: proposalData
    });

  } catch (err) {
    console.error('AI Proposal Generation Error:', err);
    res.status(500).json({ 
      error: 'Failed to generate proposal',
      message: err.message 
    });
  }
};

const enhanceProposalSection = async (req, res) => {
  try {
    const { section, content, projectContext } = req.body;
    
    if (!section || !content) {
      return res.status(400).json({ 
        error: 'Section name and content are required.' 
      });
    }

    const prompt = `
You are a professional proposal writer. Improve this ${section} for a freelance proposal.

${projectContext ? `Project Context: ${projectContext}` : ''}

Current ${section}:
${content}

Rewrite this to be more:
- Professional and compelling
- Specific and detailed
- Client-value focused
- Clear and well-structured

Return ONLY the improved text, no JSON or formatting markers.
`;

    const enhancedContent = await callGemini(prompt);
    
    res.json({
      success: true,
      section,
      enhancedContent: enhancedContent.trim()
    });

  } catch (err) {
    console.error('Proposal Enhancement Error:', err);
    res.status(500).json({ 
      error: 'Failed to enhance proposal section',
      message: err.message 
    });
  }
};

module.exports = {
  generateProposal,
  enhanceProposalSection
};
