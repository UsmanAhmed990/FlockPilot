const User = require('../models/User');
const bcrypt = require('bcryptjs');

const isAuthenticated = async (req, res, next) => {
    // Get userId from Header OR Request Body for maximum flexibility
    const userId = req.headers['x-user-id'] || req.body?.userId;

    if ((!userId || userId === 'undefined' || userId === 'null') && !req.headers['x-admin-passcode']) {
        return res.status(401).json({ message: 'Unauthorized. Please login with a valid User ID.' });
    }

    try {
        // Special case for guest admin if still needed
        if (userId === 'guest_admin' || req.headers['x-admin-passcode']) {
            const adminPasscode = req.headers['x-admin-passcode'];
            const adminEmail = req.headers['x-admin-email'];
            const storedHash = process.env.ADMIN_PASSWORD_HASH;
            const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

            if (adminPasscode && storedHash && adminEmail && allowedEmails.includes(adminEmail.toLowerCase())) {
                const isMatch = await bcrypt.compare(adminPasscode, storedHash);
                if (isMatch) {
                    req.user = { _id: 'guest_admin', id: 'guest_admin', role: 'admin', name: 'Grand Admin', isVerified: true };
                    return next();
                }
            }
            return res.status(401).json({ message: 'Invalid or missing admin credentials' });
        }

        // Validate if it's a real MongoDB ID
        if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findById(userId);
            if (user) {
                req.user = user; // Attach the full user object
                return next();
            }
        }

        return res.status(401).json({ message: 'User not found. Please register again.' });
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ message: 'Server error during authentication: ' + error.message });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please login.' });
        }

        if (req.user.role !== 'admin' && !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
            });
        }

        next();
    };
};

module.exports = { isAuthenticated, authorizeRoles };
