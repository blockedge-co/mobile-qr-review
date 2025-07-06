// API configuration

export const API_CONFIG = {
  // Base URL for the payment API
  BASE_URL: 'https://pay.blockedge.earth',
  
  // API endpoints
  ENDPOINTS: {
    CREATE_ORDER: '/api/create-order'
  },
  
  // Authentication
  // Real bearer token for BlockEdge API
  BEARER_TOKEN: process.env.NEXT_PUBLIC_API_BEARER_TOKEN || '99d40e6480dcef7549b3068d13b969473dd93616cd1a589a2a1d48cc9cd993bb',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000
}

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}