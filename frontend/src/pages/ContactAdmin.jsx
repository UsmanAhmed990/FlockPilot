import { useEffect } from 'react';
import { Shield, Mail, Phone, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/authSlice';

const ContactAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const checkStatus = async () => {
            if (!user || user.verificationStatus === 'approved') return;
            try {
                const { data } = await axios.get('/api/auth/me');
                if (data.success && data.user.verificationStatus === 'approved') {
                    // Sync the FULL user object to ensure role and other fields are correct
                    dispatch(updateProfile(data.user));
                }
            } catch (error) {
                console.error("Error checking verification status:", error);
                // If unauthorized, could mean session expired
                if (error.response?.status === 401) {
                    console.log("Session expired or unauthorized during status check.");
                }
            }
        };

        const intervalId = setInterval(checkStatus, 5000);
        checkStatus(); // Initial check

        return () => clearInterval(intervalId);
    }, [dispatch, user]);

    const isApproved = user?.verificationStatus === 'approved';

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_70%)] pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full relative z-10 text-center">
                {isApproved ? (
                    <>
                        <div className="mb-10 inline-flex p-6 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/20 animate-pulse">
                            <CheckCircle className="w-16 h-16 text-emerald-500" />
                        </div>

                        <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent tracking-tight">
                            Verification Approved
                        </h1>

                        <p className="text-xl text-emerald-400/80 mb-10 leading-relaxed font-medium">
                            Seller is verified now you can add new items to shop.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={() => navigate('/add-items')}
                                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            >
                                Add Items to Shop
                            </button>
                            <button 
                                onClick={() => navigate('/seller/dashboard')}
                                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gray-900 text-gray-400 font-black uppercase tracking-widest border border-gray-800 hover:text-white transition-all active:scale-95"
                            >
                                Seller Dashboard
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-10 inline-flex p-6 rounded-[2.5rem] bg-amber-500/10 border-2 border-amber-500/20 animate-pulse">
                            <Clock className="w-16 h-16 text-amber-500" />
                        </div>

                        <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent tracking-tight">
                            Verification Pending
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium">
                            Your seller account is currently waiting for admin approval. 
                            You will be able to add products once your account is verified.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                            <div className="p-6 rounded-3xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl hover:border-amber-500/30 transition-all group">
                                <Mail className="w-6 h-6 text-amber-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-black text-gray-500 uppercase mb-1">Email Support</p>
                                <p className="font-bold text-gray-200">admin@flockpilot.com</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl hover:border-amber-500/30 transition-all group">
                                <Phone className="w-6 h-6 text-amber-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-black text-gray-500 uppercase mb-1">WhatsApp/Call</p>
                                <p className="font-bold text-gray-200">+92 300 1234567</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                            >
                                Go Home
                            </button>
                            <button 
                                onClick={async () => {
                                    try {
                                        const { data } = await axios.get('/api/auth/me');
                                        if (data.success) {
                                            if (data.user.verificationStatus === 'approved') {
                                                dispatch(updateProfile(data.user));
                                            } else {
                                                alert('Verification is still pending. Please wait for admin approval.');
                                            }
                                        }
                                    } catch (error) {
                                        alert(error.response?.data?.message || 'Failed to check status. Please login again.');
                                    }
                                }}
                                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gray-900 text-gray-400 font-black uppercase tracking-widest border border-gray-800 hover:text-white transition-all active:scale-95"
                            >
                                Check Status
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-12 flex items-center justify-center gap-2 text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Verification System</span>
                </div>
            </div>
        </div>
    );
};

export default ContactAdmin;
