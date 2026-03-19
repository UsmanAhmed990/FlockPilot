import { useState, useEffect, useRef } from 'react';
import { Bell, UserPlus, LogIn, ShoppingCart, Package, Clock, MessageSquare } from 'lucide-react';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';

const AdminNotificationBell = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        if (!isAuthenticated || user.role !== 'admin') return;
        try {
            const { data } = await axios.get('/api/admin-notifications');
            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching admin notifications:', error);
        }
    };

    const markAsRead = async () => {
        try {
            await axios.put('/api/admin-notifications/mark-as-read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking admin notifications as read:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user.role === 'admin') {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        if (!isOpen && unreadCount > 0) {
            markAsRead();
        }
        setIsOpen(!isOpen);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'signup': return <UserPlus size={14} className="text-blue-400" />;
            case 'login': return <LogIn size={14} className="text-green-400" />;
            case 'product': return <Package size={14} className="text-amber-400" />;
            case 'order': return <ShoppingCart size={14} className="text-purple-400" />;
            case 'review':
            case 'feedback': return <MessageSquare size={14} className="text-pink-500" />;
            default: return <Bell size={14} className="text-gray-400" />;
        }
    };

    if (!isAuthenticated || user.role !== 'admin') return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-400 hover:text-amber-400 transition-colors focus:outline-none bg-gray-900 rounded-full border border-gray-800"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-lg animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="px-4 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Bell size={16} className="text-amber-500" />
                            System Alerts
                        </h3>
                        <span className="text-[10px] uppercase font-black text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Live</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell className="w-10 h-10 mx-auto mb-3 text-gray-800 opacity-20" />
                                <p className="text-xs text-gray-600 font-medium">Clear for now</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`px-4 py-3 border-b border-gray-900/50 hover:bg-gray-900 transition-colors ${!notif.isRead ? 'bg-amber-500/5' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-600 font-semibold tracking-tight">
                                                <Clock size={10} />
                                                {new Date(notif.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                        {!notif.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="px-4 py-3 bg-gray-900/80 border-t border-gray-800 text-center">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotificationBell;
