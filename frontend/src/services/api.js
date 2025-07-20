// API service for Klaape app
// This will connect to your Django backend

const API_URL = 'http://localhost:8000/api'; // Change this to your actual API URL

// Helper function for making API requests
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token if available
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Get auth token from secure storage
const getAuthToken = async () => {
  // In a real app, you would use secure storage
  // Example: return await SecureStore.getItemAsync('authToken');
  return localStorage.getItem('authToken');
};

// Profile API methods
export const profileAPI = {
  // Get user profile
  getProfile: async (userId) => {
    return fetchAPI(`/users/${userId}/profile/`);
  },
  
  // Update user profile
  updateProfile: async (userId, profileData) => {
    return fetchAPI(`/users/${userId}/profile/`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
  
  // Upload profile image
  uploadProfileImage: async (userId, imageUri) => {
    const formData = new FormData();
    
    // Create form data with image
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';
    
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    });
    
    return fetchAPI(`/users/${userId}/profile/image/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },
};

// Auth API methods
export const authAPI = {
  // Login user
  login: async (username, password) => {
    return fetchAPI('/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  
  // Register user
  register: async (userData) => {
    return fetchAPI('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Logout user
  logout: async () => {
    // In a real app, you would revoke the token on the server
    // Example: return fetchAPI('/auth/logout/', { method: 'POST' });
    localStorage.removeItem('authToken');
    return true;
  },
};

export default {
  profile: profileAPI,
  auth: authAPI,
};