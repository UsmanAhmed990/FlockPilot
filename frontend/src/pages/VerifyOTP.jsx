import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import axios from '../utils/axios';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index, value) => {
        if (value.length > 1) return; // Only single digit
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // On backspace, go to previous input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            // Focus last filled input
            const lastIndex = Math.min(pastedData.length - 1, 5);
            inputRefs.current[lastIndex]?.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post('/api/auth/verify-otp', { email, otp: otpString });
            setMessage(data.message);
            setTimeout(() => {
                navigate('/reset-password', { state: { email, otp: otpString } });
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            setMessage(`OTP resent! ${data.attemptsLeft} attempts remaining.`);
            setTimeLeft(600); // Reset timer
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
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
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Verify OTP</h2>
                        <p className="mt-2 text-gray-400 text-sm">
                            Enter the 6-digit code sent to <span className="text-amber-400 font-semibold">{email}</span>
                        </p>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Clock size={16} className={timeLeft > 0 ? 'text-amber-400' : 'text-red-500'} />
                        <span className={`font-mono font-bold text-lg ${timeLeft > 0 ? 'text-amber-400' : 'text-red-500'}`}>
                            {timeLeft > 0 ? formatTime(timeLeft) : 'EXPIRED'}
                        </span>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                            <span className="text-xl">✅</span>
                            <p className="text-green-400 text-sm font-semibold">{message}</p>
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                            <span className="text-xl">❌</span>
                            <p className="text-red-400 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    {/* OTP Input Boxes */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="flex justify-center gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value.replace(/\D/, ''))}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-gray-900 text-white
                                        ${digit ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'border-gray-700'}
                                        focus:border-amber-400 focus:shadow-[0_0_15px_rgba(245,158,11,0.4)]`}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || timeLeft <= 0}
                            className="w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-amber-700 text-black font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    VERIFYING...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    VERIFY OTP
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-amber-500 hover:text-amber-400 text-sm font-semibold flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                            {resending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-gray-500 hover:text-gray-400 text-xs flex items-center justify-center gap-1">
                            <ArrowLeft size={12} />
                            Change Email
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
