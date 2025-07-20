// API service for Klaape app
// This will connect to your Django backend

// Determine the API URL based on the environment
const getApiUrl = () => {
  // Check if we're in a GitHub Codespace
  if (process.env.CODESPACE_NAME) {
    return `https://${process.env.CODESPACE_NAME}-8000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/api`;
  }
  
  // Check if we're in Expo Go on a physical device
  if (process.env.EXPO_RUNTIME_ENV === 'expo') {
    // Use your computer's local network IP address when testing on a physical device
    // Example: return 'http://192.168.1.100:8000/api';
  }
  
  // Default for local development
  return 'http://localhost:8000/api';
};

const API_URL = getApiUrl();

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
    try {
      return await fetchAPI(`/users/${userId}/profile/`);
    } catch (error) {
      console.log('Profile not found or API not available');
      return null;
    }
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

// Role API methods
export const roleAPI = {
  // Get available roles
  getRoles: async () => {
    try {
      return await fetchAPI('/roles/');
    } catch (error) {
      console.log('Could not fetch roles, using defaults');
      return ['regular', 'pro', 'business'];
    }
  },
  
  // Get role details
  getRoleDetails: async (roleId) => {
    try {
      return await fetchAPI(`/roles/${roleId}/`);
    } catch (error) {
      console.log('Could not fetch role details');
      return null;
    }
  },
};

export default {
  profile: profileAPI,
  auth: authAPI,
  role: roleAPI,
};