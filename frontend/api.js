// Mock API for development - replace with real API later
export const mockAPI = {
  signup: async (userData) => {
    console.log('[MOCK API] Signup:', userData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success response
    return {
      ok: true,
      json: async () => ({
        message: 'User created successfully',
        user_id: Math.floor(Math.random() * 1000),
        username: userData.username
      })
    };
  },
  
  login: async (credentials) => {
    console.log('[MOCK API] Login:', credentials);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success response
    return {
      ok: true,
      json: async () => ({
        message: 'Login successful',
        user_id: Math.floor(Math.random() * 1000),
        username: credentials.username
      })
    };
  }
};