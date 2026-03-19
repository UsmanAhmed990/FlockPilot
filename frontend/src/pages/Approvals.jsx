import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import socket from '../utils/socket';
import { Users, CheckCircle, XCircle, Clock, Shield, Mail, Phone, Calendar } from 'lucide-react';

const Approvals = () => {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingSellers();

        // Real-time listener for new seller signups
        socket.on('adminNotification', (notif) => {
            if (notif.type === 'signup') {
                fetchPendingSellers();
            }
        });

        return () => {
            socket.off('adminNotification');
        };
    }, []);

    const fetchPendingSellers = async () => {
        try {
            const { data } = await axios.get('/api/admin/pending-sellers');
            if (data.success) {
                setPendingSellers(data.sellers);
            }
        } catch (err) {
            console.error('Error fetching pending sellers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (sellerId, action) => {
        const actionText = action === 'approve' ? 'Approve' : 'Reject';
        if (!window.confirm(`Are you sure you want to ${actionText} this seller?`)) return;

        try {
            const { data } = await axios.put(`/api/admin/${action}-seller/${sellerId}`);
            if (data.success) {
                setPendingSellers(prev => prev.filter(s => s._id !== sellerId));
                alert(`Seller ${action}ed successfully!`);
            }
        } catch (err) {
            console.error('Error updating seller status:', err);
            alert('Failed to update seller status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                            <Shield className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                Seller Approvals
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">Review and manage seller verification requests</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {pendingSellers.length === 0 ? (
                        <div className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-3xl p-20 text-center">
                            <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest italic">No Pending Requests</h3>
                            <p className="text-gray-600 mt-2">All sellers are currently verified.</p>
                        </div>
                    ) : (
                        pendingSellers.map((seller) => (
                            <div key={seller._id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 hover:border-amber-500/50 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-black text-2xl font-black shadow-lg">
                                            {seller.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-amber-400 transition-colors">
                                                {seller.name}
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Mail className="w-4 h-4 text-amber-500" />
                                                    <span className="font-bold">{seller.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Phone className="w-4 h-4 text-amber-500" />
                                                    <span className="font-bold">{seller.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar className="w-4 h-4 text-amber-500" />
                                                    <span className="font-bold">Joined: {new Date(seller.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Clock className="w-4 h-4 text-amber-500" />
                                                    <span className="font-bold uppercase text-[10px] tracking-widest px-2 py-0.5 bg-amber-500/10 rounded">Pending Verification</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => handleAction(seller._id, 'approve')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(seller._id, 'reject')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Approvals;
