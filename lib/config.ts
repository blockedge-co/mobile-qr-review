// API configuration

export const API_CONFIG = {
  // Base URL for the payment API
  BASE_URL: 'https://pay.blockedge.earth',
  
  // API endpoints
  ENDPOINTS: {
    CREATE_ORDER: '/api/create-order'
  },
  
  // Authentication
  // Note: This should be replaced with actual bearer token from environment variables
  BEARER_TOKEN: process.env.NEXT_PUBLIC_API_BEARER_TOKEN || 'YOUR_SECRET_BEARER_TOKEN_HERE',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000
}

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}