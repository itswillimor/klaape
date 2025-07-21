// Simple API proxy for development
const API_BASE_URL = 'http://10.0.2.57:8000';

export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API] Calling: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    console.log(`[API] Response status: ${response.status}`);
    const data = await response.json();
    console.log(`[API] Response data:`, data);
    
    return { response, data };
  } catch (error) {
    console.log(`[API] Error:`, error);
    throw error;
  }
};