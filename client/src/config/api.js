const LOCAL_API_URL = 'http://localhost:5000';
const PROD_API_URL = 'https://s76-harish-capstone-collab-o.onrender.com';

const resolveDefaultBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Use localhost backend only when running on localhost
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
      return LOCAL_API_URL;
    }
    // For any deployed site (Netlify, Vercel, etc.), use production backend
    return PROD_API_URL;
  }
  return PROD_API_URL;
};

export const API_BASE_URL = resolveDefaultBaseUrl();

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    // Auth endpoints
    login: '/auth/login',
    register: '/auth/register',
    
    // Proposal endpoints
    proposals: '/api/proposals',
    proposalsByFreelancer: (userId) => `/api/proposals/freelancer/${userId}`,
    proposalsByClient: (userId) => `/api/proposals/client/${userId}`,
    
    // Project endpoints
    projects: '/api/projects',
    projectById: (id) => `/api/projects/${id}`,
    
    // Course endpoints
    courses: '/api/courses',
    quizzes: '/api/quizzes',
    
    // User endpoints
    users: '/api/users',
    profile: '/api/profile'
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiConfig;
