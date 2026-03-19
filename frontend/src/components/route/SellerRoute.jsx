import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SellerRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useSelector(state => state.auth);
    const hasAdminSession = !!sessionStorage.getItem('admin_passcode');

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;

    // Allow admin-only sessions (logged in via /admin/login without Redux user)
    if (!isAuthenticated && hasAdminSession) {
        return children;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user && (user.role === 'seller' || user.role === 'chef' || user.role === 'admin')) {
        // Redirection logic based on verification status (for non-admins)
        if (user.role !== 'admin') {
            if (user.verificationStatus === 'pending') {
                return <Navigate to="/contact-admin" replace />;
            }
            if (user.verificationStatus === 'rejected') {
                return <Navigate to="/blocked" replace />;
            }
        }
        return children;
    }

    // Attempted to access without proper role, redirect to home
    return <Navigate to="/" replace />;
};

export default SellerRoute;
