import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.04),transparent_70%)] pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full relative z-10 text-center">
                {/* 404 Number */}
                <div className="mb-6">
                    <span className="text-[10rem] font-black leading-none bg-gradient-to-b from-amber-400 to-amber-700 bg-clip-text text-transparent tracking-tighter select-none">
                        404
                    </span>
                </div>

                {/* Icon */}
                <div className="mb-8 inline-flex p-5 rounded-[2rem] bg-amber-500/10 border-2 border-amber-500/20">
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>

                <h1 className="text-3xl font-black mb-4 text-white tracking-tight">
                    Page Not Found
                </h1>
                <p className="text-gray-500 text-lg mb-12 font-medium leading-relaxed">
                    The page you are looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-900 border border-gray-800 text-gray-300 font-black uppercase tracking-widest text-sm hover:text-white hover:border-gray-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} /> Go Back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-sm hover:bg-amber-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Go Home
                    </button>
                </div>

                <p className="mt-12 text-xs text-gray-700 font-black uppercase tracking-[0.2em]">
                    FlockPilot — Page Not Found
                </p>
            </div>
        </div>
    );
};

export default NotFound;
