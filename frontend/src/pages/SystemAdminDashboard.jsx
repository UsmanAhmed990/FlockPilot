import { useState, useEffect } from 'react';
import { Shield, Activity, Users, ShoppingCart, TrendingUp, AlertCircle, UserPlus, LogIn, Package, Star, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import axios from '../utils/axios';
import socket from '../utils/socket';
import './adminsystemdash.css';

const SystemAdminDashboard = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data } = await axios.get('/api/admin-notifications');
            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.isRead).length);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin notifications:', error);
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await axios.put('/api/admin-notifications/mark-as-read');
            setUnreadCount(0);
            setNotifications([]);
        } catch (error) {
            console.error('Error marking admin notifications read:', error);
        }
    };

    useEffect(() => {
        fetchData();

        // Socket.io Real-time Listener
        socket.on('adminNotification', (newNotification) => {
            console.log('New Admin Notification Received:', newNotification);
            setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
            setUnreadCount(prev => prev + 1);
            
            // Play notification sound (optional enhancement)
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                audio.play();
            } catch (e) {}
        });

        return () => {
            socket.off('adminNotification');
        };
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'signup': return <UserPlus size={18} className="text-blue-400" />;
            case 'login': return <LogIn size={18} className="text-green-400" />;
            case 'product': return <Package size={18} className="text-amber-400" />;
            case 'order': return <ShoppingCart size={18} className="text-purple-400" />;
            case 'review': return <Star size={18} className="text-yellow-400" />;
            case 'feedback': return <MessageSquare size={18} className="text-pink-400" />;
            default: return <AlertCircle size={18} className="text-gray-400" />;
        }
    };

    // Stats based on notifications for realism
    const stats = {
        totalTraffic: "12,458",
        newSignups: notifications.filter(n => n.type === 'signup').length,
        pendingAlerts: unreadCount,
        reviewsCount: notifications.filter(n => n.type === 'review' || n.type === 'feedback').length,
        systemHealth: "99.9%"
    };

    return (
        <div className="high min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-800 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="tager p-4 bg-amber-500 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                            <Shield size={32} className="text-black" />
                        </div>
                        <div>
                            <h1 className="systemh1 text-4xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent uppercase tracking-tighter italic">
                                Administrative System
                            </h1>
                            <p className="text-gray-500 font-bold tracking-[0.3em] text-[10px] uppercase mt-1">
                                Real-Time Infrastructure Terminal
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-gray-900/80 px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-3">
                           <div className="relative">
                               <Activity size={16} className="text-green-500 animate-pulse" />
                               <div className="absolute inset-0 bg-green-500 blur-sm opacity-20 animate-pulse"></div>
                           </div>
                           <span className="text-xs font-black text-gray-400 uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={<Activity className="text-blue-400" />} label="Network Traffic" value={stats.totalTraffic} status="Normal" />
                    <StatCard icon={<UserPlus className="text-green-400" />} label="Recent Signups" value={stats.newSignups} status="Growth" />
                    <StatCard icon={<AlertCircle className="text-red-400" />} label="Unread Alerts" value={stats.pendingAlerts} status={stats.pendingAlerts > 0 ? "Critical" : "Clear"} />
                    <StatCard icon={<Star className="text-yellow-400" />} label="Reviews & Feedback" value={stats.reviewsCount} status="Active" />
                </div>

                {/* Notifications Panel */}
                <div className="ely rbg-gray-900/40 rounded-[2.5rem] border border-gray-800 p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="ripon flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                                <AlertCircle className="text-amber-500" />
                            </div>
                            <div>
                                <h2 className="elyh2 text-2xl font-black text-white tracking-tight uppercase italic">Live Notification Stream</h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Real-time WebSocket Sync Active</p>
                            </div>
                        </div>

                        {notifications.length > 0 && (
                            <button 
                                onClick={markAllRead}
                                className="rip-btn flex items-center gap-2 px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-600 hover:text-white transition-all font-black text-xs uppercase tracking-tighter"
                            >
                                <CheckCircle size={14} />
                                Clear All Notifications
                            </button>
                        )}
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center p-20">
                                <Activity className="text-amber-500 animate-spin" size={40} />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-gray-800">
                                <ShoppingCart className="mx-auto text-gray-700 mb-4" size={48} />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm italic">System logs are currently empty</p>
                            </div>
                        ) : (
                            notifications.map((n, index) => (
                                <div id='quick'
                                    key={n._id} 
                                    className={`flex items-start gap-6 p-6 rounded-3xl border transition-all duration-500 transform ${n.isRead ? 'bg-black/20 border-gray-800/30' : 'bg-gray-800/40 border-amber-500/30 shadow-[0_4px_30px_rgba(245,158,11,0.05)] -translate-y-1'}`}
                                    style={{ animation: !n.isRead ? 'slide-in 0.5s ease-out' : 'none' }}
                                >
                                    <div className={`mt-1 p-3 rounded-2xl ${n.isRead ? 'bg-gray-800/50 text-gray-500' : 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'}`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${n.isRead ? 'text-gray-600' : 'text-amber-500'}`}>
                                                {n.type} Event
                                            </span>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock size={10} />
                                                <span className="text-[9px] font-bold uppercase">{new Date(n.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <p className={`text-sm font-bold tracking-tight ${n.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {n.message}
                                        </p>
                                    </div>
                                    {!n.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shadow-[0_0_10px_rgba(245,158,11,1)]"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slide-in {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #000;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #F59E0B;
                }
            ` }} />
        </div>
    );
};

const StatCard = ({ icon, label, value, status }) => (
    <div className="realme bg-gray-900/60 p-8 rounded-[2rem] border border-gray-800 hover:border-amber-500/20 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-black rounded-2xl border border-gray-800 group-hover:bg-amber-500 transition-all duration-500 group-hover:text-black text-amber-500 group-hover:rotate-12 group-hover:scale-110">
                {icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Critical' ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
                {status}
            </span>
        </div>
        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</h3>
        <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
);

export default SystemAdminDashboard;
