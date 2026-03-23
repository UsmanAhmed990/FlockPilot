import { useEffect, useState } from 'react';
import { Shield, Mail, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/authSlice';
import socket from '../utils/socket';
import './contacradmin.css';

const ContactAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const checkStatus = async () => {
            if (!user) return;
            try {
                const { data } = await axios.get('/api/auth/me');
                if (data.success && data.user.verificationStatus !== user.verificationStatus) {
                    // Sync the FULL user object if status changed
                    dispatch(updateProfile(data.user));
                }
            } catch (error) {
                console.error("Error checking verification status:", error);
            }
        };

        socket.on('verificationStatusUpdate', (data) => {
            console.log('Real-time verification update RECEIVED:', data);
            checkStatus(); // Immediate sync
        });

        const intervalId = setInterval(checkStatus, 5000);
        checkStatus(); // Initial check

        return () => {
            clearInterval(intervalId);
            socket.off('verificationStatusUpdate');
        };
    }, [dispatch, user]);

    const isApproved = user?.verificationStatus === 'approved';
    const isRejected = user?.verificationStatus === 'rejected';

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

                        <h1 className="conh1 text-5xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent tracking-tight">
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
                        {isRejected ? (
                            <>
                                <div className="mb-10 inline-flex p-6 rounded-[2.5rem] bg-red-500/10 border-2 border-red-500/20">
                                    <XCircle className="w-16 h-16 text-red-500" />
                                </div>

                                <h1 className="conh1 text-5xl font-black mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent tracking-tight">
                                    Verification Rejected
                                </h1>

                                <p className="text-xl text-red-400/80 mb-10 leading-relaxed font-medium">
                                    Your approval verification is rejected by admin.<br/>
                                    Please contact admin for help.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className=" coner mb-10 inline-flex p-6 rounded-[2.5rem] bg-amber-500/10 border-2 border-amber-500/20 animate-pulse">
                                    <Clock className="w-16 h-16 text-amber-500" />
                                </div>

                                <h1 className="conh1 text-5xl font-black mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent tracking-tight">
                                    Verification Pending
                                </h1>

                                <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium">
                                    Your seller account is currently waiting for admin approval. 
                                    You will be able to add products once your account is verified.
                                </p>
                            </>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                            <div className="oxford p-6 rounded-3xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl hover:border-amber-500/30 transition-all group">
                                <Mail className="w-6 h-6 text-amber-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-black text-gray-500 uppercase mb-1">Email Support</p>
                                <p className="font-bold text-gray-200">alertnotification83@gmail.com</p>
                            </div>
                            <div className="oxford p-6 rounded-3xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl hover:border-amber-500/30 transition-all group">
                                <Phone className="w-6 h-6 text-amber-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-black text-gray-500 uppercase mb-1">WhatsApp/Call</p>
                                <p className="font-bold text-gray-200">+92 3261949908</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={() => navigate('/')}
                                className={`res w-full sm:w-auto px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 ${
                                    isRejected 
                                    ? 'bg-red-500 text-black hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                                    : 'bg-amber-500 text-black hover:bg-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                                }`}
                            >
                                {isRejected ? 'Back to Home' : 'Go Home'}
                            </button>
                            
                            {!isRejected && (
                                <button  id='resp'
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
                            )}
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
