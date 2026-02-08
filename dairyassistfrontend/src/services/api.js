import axios from 'axios'; // Optional if you switch to axios, but staying with fetch below

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthToken = (endpoint = '') => {
  // 1. Skip token for Auth/Public endpoints to avoid unnecessary auth errors
  if (endpoint.includes('/auth/')) {
    return null;
  }

  // 2. Retrieve tokens from storage
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');

  // 3. Context Checks
  // Check if the API request is specifically for an admin endpoint
  const isApiAdminEndpoint = endpoint.startsWith('/admin');

  // Check if the user is currently browsing the Admin Dashboard in the browser
  // (Assumes your React Admin routes start with /admin, e.g., localhost:5173/admin/dashboard)
  const isBrowserAdminPage = window.location.pathname.startsWith('/admin');

  // 4. Priority Logic
  // If hitting an admin API OR browsing admin pages, prioritize the Admin Token.
  if (isApiAdminEndpoint || (isBrowserAdminPage && adminToken)) {
    return adminToken;
  }

  // Otherwise, default to the User Token
  return userToken;
};

const handleResponse = async (response) => {
  // Attempt to parse JSON, fallback to empty object if body is empty (e.g. 204 No Content)
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `HTTP ${response.status}`;
    
    // Handle Unauthorized (401)
    if (response.status === 401) {
      // Decide which login page to redirect to based on current location
      const isAdminPage = window.location.pathname.includes('/admin');
      
      if (isAdminPage) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          if (!window.location.pathname.includes('/admin/login')) {
             window.location.href = '/admin/login';
          }
      } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('/login')) {
             window.location.href = '/login';
          }
      }
    }
    throw new Error(message);
  }
  
  return data;
};

const api = {
  get: async (endpoint) => {
    const token = getAuthToken(endpoint);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const token = getAuthToken(endpoint);
    
    // FIX: Handle File Uploads (FormData)
    // If data is FormData, do NOT set Content-Type (browser sets it automatically with boundary)
    // and do NOT stringify the body.
    const isFormData = data instanceof FormData;
    
    const headers = {
      'Authorization': token ? `Bearer ${token}` : ''
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data || {}),
    });
    
    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const token = getAuthToken(endpoint);
    
    // FIX: Handle FormData for PUT requests
    const isFormData = data instanceof FormData;
    
    const headers = {
      'Authorization': token ? `Bearer ${token}` : ''
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data || {}),
    });
    
    return handleResponse(response);
  },

  patch: async (endpoint, data) => {
    const token = getAuthToken(endpoint);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const token = getAuthToken(endpoint);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }
};

export default api;