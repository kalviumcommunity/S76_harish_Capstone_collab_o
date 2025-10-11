const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the AI client
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProjectDescription = async (req, res) => {
  try {
    console.log('AI Description Generation Request:', req.body);
    const { prompt, title, category, type } = req.body;

    if (!prompt) {
      console.log('Error: No prompt provided');
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log('Initializing Gemini AI model...');
    // Initialize the generative model with Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Create a comprehensive prompt for project description generation
    const aiPrompt = `
As a professional freelance project consultant, create a detailed, professional project description based on the following requirements:

User Request: "${prompt}"
Project Title: "${title || 'Not specified'}"
Category: "${category || 'General'}"

Please generate a comprehensive project description that includes:

1. **Project Overview**: Clear and engaging summary
2. **Key Requirements**: Specific technical and functional requirements
3. **Deliverables**: What the client will receive
4. **Skills Needed**: Technical skills required
5. **Project Scope**: Clear boundaries and expectations

Requirements for the description:
- Professional and clear language
- 150-300 words in length
- Include specific technical details when relevant
- Make it appealing to freelancers
- Include timeline expectations
- Mention any specific technologies if applicable
- Be specific about desired outcomes

Format the response as a well-structured project description that a client would post on a freelancing platform.

Generate only the project description, no additional text or explanations.
`;

    console.log('Sending request to Gemini AI...');
    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    const generatedDescription = response.text();
    console.log('Generated description length:', generatedDescription?.length);

    if (!generatedDescription) {
      throw new Error('No description generated');
    }

    // Generate additional suggestions for variety
    const suggestionPrompt = `
Based on this project request: "${prompt}"
Generate 2 alternative brief project descriptions (2-3 sentences each) with different angles or approaches.
Format as a JSON array of strings.
Return only the JSON array, no additional text.
`;

    let suggestions = [];
    try {
      const suggestionResult = await model.generateContent(suggestionPrompt);
      const suggestionResponse = await suggestionResult.response;
      const suggestionText = suggestionResponse.text();
      
      // Try to parse JSON suggestions
      const cleanedSuggestionText = suggestionText.replace(/```json|```/g, '').trim();
      suggestions = JSON.parse(cleanedSuggestionText);
    } catch (suggestionError) {
      console.log('Suggestion generation failed:', suggestionError.message);
      // Continue without suggestions
    }

    res.json({
      success: true,
      description: generatedDescription.trim(),
      suggestions: Array.isArray(suggestions) ? suggestions : [],
      metadata: {
        prompt,
        title,
        category,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Project description generation error:', error);
    
    // Provide fallback response
    const fallbackDescription = `
Project Overview:
Looking for a skilled freelancer to help with ${req.body.prompt || 'this project'}. This project requires attention to detail and professional execution.

Key Requirements:
- Deliver high-quality work within specified timeline
- Regular communication and progress updates
- Follow best practices and industry standards
- Provide documentation for deliverables

Deliverables:
- Complete project as specified
- Source files and documentation
- Testing and quality assurance
- Post-completion support if needed

Skills Needed:
- Relevant technical expertise
- Strong communication skills
- Problem-solving abilities
- Deadline-oriented approach

Please provide your portfolio and relevant experience when applying.
    `.trim();

    res.json({
      success: true,
      description: fallbackDescription,
      suggestions: [],
      fallback: true,
      metadata: {
        prompt: req.body.prompt,
        generatedAt: new Date().toISOString()
      }
    });
  }
};

module.exports = {
  generateProjectDescription
};