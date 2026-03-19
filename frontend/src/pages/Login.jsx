import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, User, ChefHat } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [role, setRole] = useState('buyer');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error) {
            setLoginError(error);
            dispatch(clearErrors());
            // Clear error message after 5 seconds
            const timer = setTimeout(() => setLoginError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, isAuthenticated, error, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login({ email: email.toLowerCase(), password, role })); 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black/90 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-700 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-scale-in">
        {/* Card */}
        <div className="bg-black-900/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-amber-600">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              Welcome Back!
            </h2>
            <p className="mt-2 text-gray-300">Login to continue to FlockPilot Marketplace</p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-center font-medium animate-pulse">
              {loginError}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={submitHandler}>
            {/* Role Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    role === 'buyer'
                      ? 'border-amber-600 bg-amber-500 shadow-md text-black'
                      : 'border-gray-800 hover:border-amber-400 text-white'
                  }`}
                >
                  <User className={`w-6 h-6 mx-auto mb-2 ${role === 'buyer' ? 'text-black' : 'text-amber-400'}`} />
                  <div className={`text-[10px] font-black uppercase tracking-widest ${role === 'buyer' ? 'text-black' : 'text-white'}`}>
                    Login as Buyer
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    role === 'seller'
                      ? 'border-amber-700 bg-amber-600 shadow-md text-black'
                      : 'border-gray-800 hover:border-amber-400 text-white'
                  }`}
                >
                  <ChefHat className={`w-6 h-6 mx-auto mb-2 ${role === 'seller' ? 'text-black' : 'text-amber-400'}`} />
                  <div className={`text-[10px] font-black uppercase tracking-widest ${role === 'seller' ? 'text-black' : 'text-white'}`}>
                    Login as Seller
                  </div>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-amber-400" />
                </div>
                <input
                  type="email"
                  required
                  className="input-field pl-12 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none w-full py-3"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-amber-400" />
                </div>
                <input
                  type="password"
                  required
                  className="input-field pl-12 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none w-full py-3"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-amber-700 text-black font-bold rounded-xl hover:scale-105 transition-transform"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  SIGNING IN...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  LOGIN
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-amber-500 hover:text-amber-600 transition-colors">
                Sign up now
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  
    );
};

export default Login;
