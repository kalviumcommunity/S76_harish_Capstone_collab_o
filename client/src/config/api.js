// API configuration based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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