import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { Mail, Lock, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isUnlocked, setIsUnlocked] = useState(!!sessionStorage.getItem('admin_passcode'));
    const [email, setEmail] = useState(sessionStorage.getItem('admin_email') || '');
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUnlock = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/auth/verify-admin', { email, passcode });
            
            if (data.success) {
                sessionStorage.setItem('admin_passcode', passcode);
                sessionStorage.setItem('admin_email', email);
                setIsUnlocked(true);
                window.location.reload(); // Force refresh to update Navbar and other components
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Access denied. Invalid email or passcode');
        } finally {
            setLoading(false);
        }
    };

    const handleLock = () => {
        sessionStorage.removeItem('admin_passcode');
        sessionStorage.removeItem('admin_email');
        setIsUnlocked(false);
        setPasscode('');
        navigate('/admin/login');
    };

    if (isUnlocked) {
        return (
            <div className="relative">
                {/* ADMIN MODE INDICATOR */}
                <div className="fixed top-24 right-4 md:right-8 z-[100] animate-in fade-in slide-in-from-right-10 duration-500">
                    <button
                        onClick={handleLock}
                        className="node group flex items-center gap-3 bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-500 font-bold px-4 py-2.5 rounded-2xl shadow-2xl hover:bg-amber-500 hover:text-black transition-all duration-300"
                    >
                        <div className="relative flex items-center justify-center w-2 h-2">
                            <span className="absolute w-full h-full bg-amber-400 rounded-full animate-ping opacity-75"></span>
                            <span className="relative w-2 h-2 bg-amber-500 rounded-full"></span>
                        </div>
                        <span className=" text-xs tracking-widest uppercase">Admin Secure Node</span>
                        <div className="w-px h-4 bg-amber-500/30"></div>
                        <span className="text-[10px] opacity-70 group-hover:opacity-100">LOCK</span>
                    </button>
                </div>

                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#050505] text-white relative overflow-hidden font-inter">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-amber-600/10 blur-[180px] rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-amber-500/10 blur-[180px] rounded-full animate-pulse-slow delay-700"></div>
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-700">
                {/* DECORATIVE ELEMENTS */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-600/20 blur-3xl rounded-full"></div>

                <div className="relative rounded-[2.5rem] p-[1.5px] bg-gradient-to-br from-amber-400/30 via-amber-500/50 to-amber-600/30 shadow-[0_32px_64px_-16px_rgba(245,158,11,0.2)]">
                    <div className="bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-[2.45rem] p-10 md:p-14 border border-white/5">
                        {/* HEADER */}
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-amber-500 opacity-20 blur-2xl rounded-full"></div>
                                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] rotate-3">
                                    <ShieldCheck className="h-12 w-12 text-black" strokeWidth={2.5} />
                                </div>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight text-white mb-3 uppercase italic">
                                Restricted <span className="text-amber-500">Access</span>
                            </h2>
                            <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase">
                                Multi-Factor Admin Verification
                            </p>
                        </div>

                        {/* ACCESS FORM */}
                        <form onSubmit={handleUnlock} className="space-y-6">
                            <div className="space-y-5">
                                {/* Email Field */}
                                <div className="group space-y-2">
                                    <label className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.2em] ml-1">
                                        Authorized Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                                            <Mail className="h-5 w-5 text-amber-500/40 group-focus-within:text-amber-500 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@flockpilot.com"
                                            className="w-full bg-[#111] border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-zinc-700 font-bold"
                                        />
                                    </div>
                                </div>

                                {/* Passcode Field */}
                                <div className="group space-y-2">
                                    <label className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.2em] ml-1">
                                        Security Passcode
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                                            <Lock className="h-5 w-5 text-amber-500/40 group-focus-within:text-amber-500 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={passcode}
                                            onChange={(e) => {
                                                setPasscode(e.target.value);
                                                if (error) setError('');
                                            }}
                                            placeholder="••••••••"
                                            className="w-full bg-[#111] border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-white text-xl tracking-[0.5em] focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none text-center transition-all placeholder:text-zinc-700 placeholder:tracking-normal font-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ERROR MESSAGE */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-300">
                                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                                    <p className="text-red-500 text-xs font-bold leading-tight uppercase tracking-wider">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* ACTION BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative group w-full py-5 rounded-[1.25rem] font-black text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span className="text-xs uppercase tracking-[0.2em]">Authenticating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xs uppercase tracking-[0.2em]">Unlock Secure Terminal</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>

                            <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                                Terminal session will persist until <br /> locked manually or browser closes
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateRoute;