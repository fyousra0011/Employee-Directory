import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - logs every request
api.interceptors.request.use(
    (config) => {
        console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - centralizes error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = 'An unexpected error occurred. Please try again.';
        
        if (error.response) {
            // Server responded with error
            message = error.response.data?.error || `Server error (${error.response.status})`;
        } else if (error.request) {
            // No response (network error)
            message = 'Network error: Could not reach the server.';
        }
        
        // Attach friendly message to error for components to use
        error.userMessage = message;
        return Promise.reject(error);
    }
);

export default api;