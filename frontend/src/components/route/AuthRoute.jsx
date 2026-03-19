import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector(state => state.auth);
    const hasAdminSession = !!sessionStorage.getItem('admin_passcode');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-royal-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated && !hasAdminSession) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AuthRoute;
