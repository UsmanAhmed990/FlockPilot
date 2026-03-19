import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from '../utils/axios';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const otp = location.state?.otp || '';

    useEffect(() => {
        if (!email || !otp) {
            navigate('/forgot-password');
        }
    }, [email, otp, navigate]);

    // Password strength
    const getStrength = (pass) => {
        let score = 0;
        if (pass.length >= 6) score++;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const strength = getStrength(newPassword);
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Password reset failed');
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
                            <KeyRound className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Reset Password</h2>
                        <p className="mt-2 text-gray-400 text-sm">
                            Create a strong new password for your account
                        </p>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                            <span className="text-xl">🎉</span>
                            <p className="text-green-400 text-sm font-semibold">{message}</p>
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                            <span className="text-xl">❌</span>
                            <p className="text-red-400 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-amber-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    className="pl-12 pr-12 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none w-full py-3"
                                    placeholder="Min. 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-amber-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Strength Indicator */}
                            {newPassword && (
                                <div className="mt-3">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-800'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-semibold ${strength <= 2 ? 'text-red-400' : strength <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {strengthLabels[strength]}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-amber-400" />
                                </div>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    className={`pl-12 pr-12 bg-gray-800 text-white border rounded-lg focus:ring-1 outline-none w-full py-3 ${
                                        confirmPassword && confirmPassword !== newPassword
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : confirmPassword && confirmPassword === newPassword
                                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                            : 'border-gray-700 focus:border-amber-500 focus:ring-amber-500'
                                    }`}
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-amber-400"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {confirmPassword && confirmPassword !== newPassword && (
                                <p className="text-red-400 text-xs mt-1 font-semibold">Passwords don't match</p>
                            )}
                            {confirmPassword && confirmPassword === newPassword && (
                                <p className="text-green-400 text-xs mt-1 font-semibold">✓ Passwords match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                            className="w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-amber-700 text-black font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    RESETTING...
                                </>
                            ) : (
                                <>
                                    <KeyRound className="w-5 h-5" />
                                    RESET PASSWORD
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-gray-500 hover:text-gray-400 text-xs flex items-center justify-center gap-1">
                            <ArrowLeft size={12} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
