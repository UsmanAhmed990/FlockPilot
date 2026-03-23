import axios from 'axios';

// Set full backend URL (bypassing proxy)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5020';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Add interceptor to inject admin passcode and user identification
axios.interceptors.request.use((config) => {
    // Admin Identification - Only send if user role is admin OR if accessing admin endpoint
    const userStr = localStorage.getItem('user');
    const parsedUser = userStr ? JSON.parse(userStr) : null;
    
    // Admin Passcode & Email
    const passcode = sessionStorage.getItem('admin_passcode');
    const adminEmail = sessionStorage.getItem('admin_email');
    
    // Check if this is an admin-specific API endpoint
    const isAdminEndpoint = config.url.includes('/admin');

    if (passcode && (isAdminEndpoint || parsedUser?.role === 'admin')) {
        config.headers['X-Admin-Passcode'] = passcode;
    }
    if (adminEmail && (isAdminEndpoint || parsedUser?.role === 'admin')) {
        config.headers['X-Admin-Email'] = adminEmail;
    }

    // Simple User Identification (localStorage)
    if (parsedUser) {
        config.headers['X-User-Id'] = parsedUser._id;
    }

    return config;
});

export default axios;
