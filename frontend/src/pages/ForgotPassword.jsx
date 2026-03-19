import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Shield } from 'lucide-react';
import axios from '../utils/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            setMessage(data.message);
            // Navigate to OTP page after 1.5s
            setTimeout(() => {
                navigate('/verify-otp', { state: { email } });
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black/90 py-12 px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-700 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="bg-black-900/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-amber-600">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl mb-4 shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>
                        <p className="mt-2 text-gray-400 text-sm">
                            Enter your registered email and we'll send a 6-digit OTP to reset your password.
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                            <span className="text-xl">✅</span>
                            <p className="text-green-400 text-sm font-semibold">{message}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                            <span className="text-xl">❌</span>
                            <p className="text-red-400 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="pl-12 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none w-full py-3"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-amber-700 text-black font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    SENDING OTP...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    SEND OTP
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-amber-500 hover:text-amber-400 text-sm font-semibold flex items-center justify-center gap-2">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
