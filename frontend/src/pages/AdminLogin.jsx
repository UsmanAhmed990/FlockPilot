import { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';

const AdminLogin = () => {
    const [form, setForm] = useState({ email: '', passcode: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/api/auth/verify-admin', {
                email: form.email,
                passcode: form.passcode
            });
            if (data.success) {
                // Store same keys as PrivateRoute expects
                sessionStorage.setItem('admin_passcode', form.passcode);
                sessionStorage.setItem('admin_email', form.email);
                navigate('/admin/system');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Access denied. Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(239,68,68,0.05),transparent_60%)] pointer-events-none" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/5 rounded-full blur-3xl" />

            <div className="max-w-md w-full relative z-10">
                {/* Logo */}
                <div className="text-center mb-12">
                    <div className="inline-flex p-5 rounded-[2rem] bg-red-500/10 border-2 border-red-500/20 mb-6">
                        <Shield className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        Admin Access
                    </h1>
                    <p className="text-gray-500 mt-2 font-bold uppercase tracking-[0.2em] text-xs">
                        Restricted — Authorized Personnel Only
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-8 backdrop-blur-xl space-y-6">
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 pl-2">Admin Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="admin@example.com"
                                className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Passcode */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 pl-2">Admin Passcode</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="passcode"
                                value={form.passcode}
                                onChange={handleChange}
                                required
                                placeholder="Enter your passcode"
                                className="w-full bg-black border border-gray-800 rounded-2xl py-4 px-12 text-gray-200 focus:outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-gray-700"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-[0_0_24px_rgba(239,68,68,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><LogIn size={18} /> Enter Admin Panel</>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-700 font-bold uppercase tracking-widest">
                        All access attempts are logged
                    </p>
                </form>

                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-600 hover:text-gray-400 text-xs font-black uppercase tracking-widest transition-colors"
                    >
                        ← Back to Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
