import { ShieldAlert, XCircle, Home, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blocked = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_70%)] pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full relative z-10 text-center">
                <div className="mb-10 inline-flex p-6 rounded-[2.5rem] bg-red-500/10 border-2 border-red-500/20">
                    <ShieldAlert className="w-16 h-16 text-red-500" />
                </div>

                <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent tracking-tight">
                    Account Restricted
                </h1>

                <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium">
                    Your access to the seller tools has been restricted by the admin. 
                    Please contact support if you believe this is a mistake.
                </p>

                <div className="p-8 rounded-[2rem] bg-gray-900/50 border border-red-500/20 backdrop-blur-xl mb-12">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
                        <div className="p-3 rounded-xl bg-red-500/10">
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Status</p>
                            <p className="font-bold text-red-400">Permanently Blocked</p>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-4 italic">"Policy violation or incomplete documentation"</p>
                        <div className="flex flex-col gap-2">
                             <a href="mailto:admin@flockpilot.com" className="font-bold text-gray-200 flex items-center justify-center gap-2 hover:text-red-400 transition-colors">
                                <Mail size={16} className="text-red-500" /> info@flockpilot.com
                             </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest border border-gray-800 hover:border-red-500/50 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Home className="w-5 h-5" /> Go home
                    </button>
                    <button 
                         onClick={() => navigate('/logout')}
                        className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-gray-600">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol System</span>
                </div>
            </div>
        </div>
    );
};

export default Blocked;
