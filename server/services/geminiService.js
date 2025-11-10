require('dotenv').config({ path: './config/.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-1.5-flash';

let fetchPolyfill = null;
try {
  // node-fetch v2 supports CommonJS require
  fetchPolyfill = require('node-fetch');
  fetchPolyfill = fetchPolyfill.default || fetchPolyfill;
} catch (err) {
  fetchPolyfill = null;
}

const getFetch = () => {
  if (typeof fetch === 'function') return fetch;
  if (fetchPolyfill) return fetchPolyfill;
  throw new Error('Fetch API is not available in this Node runtime. Please use Node 18+ or install node-fetch.');
};

const parseJsonString = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    throw new Error(`Gemini response could not be parsed as JSON: ${err.message}`);
  }
};

const findJsonBlock = (str) => {
  const start = str.search(/[{[]/);
  if (start === -1) return null;
  const openChar = str[start];
  const closeChar = openChar === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = start; i < str.length; i++) {
    const char = str[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === openChar) depth++;
    if (char === closeChar) {
      depth--;
      if (depth === 0) {
        return str.slice(start, i + 1);
      }
    }
  }

  return null;
};

const extractJson = (text) => {
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Gemini returned an empty response.');
  }

  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return parseJsonString(fencedMatch[1]);
  }

  const jsonBlock = findJsonBlock(trimmed);
  if (jsonBlock) {
    return parseJsonString(jsonBlock);
  }

  return parseJsonString(trimmed);
};

const shouldRetryWithoutJsonMime = (err) => {
  if (!err) return false;
  const message = (err.message || '').toLowerCase();
  if (message.includes('mime') || message.includes('response_mime_type')) return true;
  if (message.includes('could not be parsed as json')) return true;
  if (err.status && err.status === 400) return true;
  return false;
};

const getGeminiJson = async (prompt, { preferJsonMime = true } = {}) => {
  const request = async (responseMimeType) => {
    const text = await callGeminiWithFallback({ prompt, responseMimeType });
    return extractJson(text);
  };

  if (!preferJsonMime) {
    return request('text/plain');
  }

  try {
    return await request('application/json');
  } catch (err) {
    if (shouldRetryWithoutJsonMime(err)) {
      return request('text/plain');
    }
    throw err;
  }
};

const callGemini = async ({ prompt, model = PRIMARY_MODEL, responseMimeType = 'text/plain' }) => {
  if (!prompt) throw new Error('Prompt is required.');
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured.');

  const fetchFn = getFetch();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType,
    },
  };

  const response = await fetchFn(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let payload;
  try {
    payload = await response.json();
  } catch (err) {
    const fallback = await response.text().catch(() => '');
    throw new Error(`Gemini response was not JSON (status ${response.status}): ${fallback || err.message}`);
  }

  if (!response.ok) {
    const message = payload?.error?.message || `Gemini request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = payload?.error;
    throw error;
  }

  const parts = payload?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((part) => part?.text || '').join('').trim();
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }
  return text;
};

const callGeminiWithFallback = async (options = {}) => {
  try {
    return await callGemini(options);
  } catch (err) {
    const shouldFallback = !options.model && PRIMARY_MODEL !== FALLBACK_MODEL;
    if (!shouldFallback) throw err;

    console.warn(`Primary Gemini model "${PRIMARY_MODEL}" failed. Falling back to "${FALLBACK_MODEL}". Error: ${err.message}`);
    return callGemini({ ...options, model: FALLBACK_MODEL });
  }
};

async function generateCourse(prompt) {
  const formattedPrompt = `
Create a structured online course for: "${prompt}".
Return JSON with:
- courseTitle
- description
- lessons (each with title, summary, topics[])
`;

  try {
    return await getGeminiJson(formattedPrompt);
  } catch (err) {
    throw new Error(err?.message || 'Failed to generate course with Gemini.');
  }
}

const normalizeQuiz = (payload, requestedCount) => {
  const candidates =
    Array.isArray(payload) ? payload :
    Array.isArray(payload?.quiz) ? payload.quiz :
    Array.isArray(payload?.questions) ? payload.questions :
    Array.isArray(payload?.quiz?.questions) ? payload.quiz.questions :
    null;

  if (!candidates || candidates.length === 0) {
    throw new Error('Gemini quiz response did not contain a question list.');
  }

  const optionKeys = ['options', 'choices', 'answers', 'variants'];
  const normalizeOptions = (item) => {
    for (const key of optionKeys) {
      if (Array.isArray(item?.[key]) && item[key].length) {
        return item[key].map((opt) => String(opt).trim()).filter(Boolean);
      }
    }
    const lettered = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'optionF']
      .map((key) => item?.[key])
      .filter(Boolean)
      .map((opt) => String(opt).trim());
    return lettered;
  };

  const getAnswer = (item, options) => {
    const answerKeys = ['answer', 'correctAnswer', 'correct', 'solution', 'correct_option'];
    for (const key of answerKeys) {
      if (item?.[key]) return String(item[key]).trim();
    }
    if (typeof item?.answerIndex === 'number' && options[item.answerIndex]) {
      return options[item.answerIndex];
    }
    if (typeof item?.correctIndex === 'number' && options[item.correctIndex]) {
      return options[item.correctIndex];
    }
    return options[0] || '';
  };

  const normalized = candidates
    .map((item, idx) => {
      const question =
        item?.question ||
        item?.prompt ||
        item?.title ||
        (typeof item === 'string' ? item : null);
      const options = normalizeOptions(item);
      const answer = getAnswer(item, options);
      if (!question || options.length < 2 || !answer) return null;
      return {
        question: String(question).trim(),
        options,
        answer: String(answer).trim()
      };
    })
    .filter(Boolean);

  if (!normalized.length) {
    throw new Error('Gemini returned quiz entries but none were usable.');
  }

  if (requestedCount > 0 && normalized.length > requestedCount) {
    return normalized.slice(0, requestedCount);
  }
  return normalized;
};

async function generateQuiz({ topic, numQuestions, difficulty }) {
  const sanitizedTopic = (topic || '').trim();
  if (!sanitizedTopic) throw new Error('Quiz topic is required.');
  const maxQuestions = Math.max(1, Math.min(Number(numQuestions) || 10, 50));
  const sanitizedDifficulty = (difficulty || 'Beginner').trim();

  const prompt = `
Generate a ${maxQuestions}-question multiple choice quiz on "${sanitizedTopic}" for ${sanitizedDifficulty} learners.
Respond with pure JSON array using this shape:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "answer": "string"
  }
]
`;

  try {
    const data = await getGeminiJson(prompt);
    return normalizeQuiz(data, maxQuestions);
  } catch (err) {
    throw new Error(err?.message || 'Failed to generate quiz with Gemini.');
  }
}

module.exports = { generateCourse, generateQuiz };
