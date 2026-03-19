import axios from 'axios';

// Set full backend URL (bypassing proxy)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5020';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Add interceptor to inject admin passcode and user identification
axios.interceptors.request.use((config) => {
    // Admin Passcode & Email
    const passcode = sessionStorage.getItem('admin_passcode');
    const adminEmail = sessionStorage.getItem('admin_email');
    if (passcode) {
        config.headers['X-Admin-Passcode'] = passcode;
    }
    if (adminEmail) {
        config.headers['X-Admin-Email'] = adminEmail;
    }

    // Simple User Identification (localStorage)
    const user = localStorage.getItem('user');
    if (user) {
        const parsedUser = JSON.parse(user);
        config.headers['X-User-Id'] = parsedUser._id;
    }

    return config;
});

export default axios;
