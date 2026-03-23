import { useState, useEffect, useRef } from 'react';
import { Bell, Package, XCircle, Clock, MessageSquare } from 'lucide-react';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';
import socket from '../../utils/socket';

const NotificationBell = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        if (!isAuthenticated || (user.role !== 'seller' && user.role !== 'chef' && user.role !== 'admin')) return;
        try {
            console.log('Fetching notifications for role:', user.role);
            const { data } = await axios.get('/api/notifications');
            if (data.success) {
                console.log('Notifications received:', data.notifications.length);
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async () => {
        try {
            await axios.put('/api/notifications/mark-as-read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        // Fetch initial notifications
        fetchNotifications();

        // Join personal room for real-time notifications
        const roomId = user._id || user.id;
        console.log('NotificationBell: Joining room:', roomId);
        socket.emit('join', roomId);

        // Listen for real-time notifications
        socket.on('notification', (newNotif) => {
            console.log('NotificationBell: Real-time notification received:', newNotif);
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Optional: Haptic/Sound
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                audio.play();
            } catch (e) {}
        });

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            socket.off('notification');
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAuthenticated, user]);

    const toggleDropdown = () => {
        if (!isOpen && unreadCount > 0) {
            markAsRead();
        }
        setIsOpen(!isOpen);
    };

    if (!isAuthenticated || (user.role !== 'seller' && user.role !== 'chef' && user.role !== 'admin')) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-400 hover:text-amber-400 transition-colors focus:outline-none"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl z-50 overflow-hidden transform transition-all animate-slide-up">
                    <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <h3 className="text-sm font-bold text-white">Notifications</h3>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Latest</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                                <p className="text-sm text-gray-500">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors ${!notif.isRead ? 'bg-amber-400/5' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 p-1.5 rounded-full ${
                                            notif.type === 'review' || notif.type === 'feedback' ? 'bg-blue-500/10 text-blue-500' :
                                            notif.type === 'order_created' ? 'bg-green-500/10 text-green-500' : 
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                            {notif.type === 'review' || notif.type === 'feedback' ? <MessageSquare size={14} /> : 
                                             notif.type === 'order_created' ? <Package size={14} /> : 
                                             <XCircle size={14} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-gray-200 leading-normal">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-500">
                                                <Clock size={10} />
                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        {!notif.isRead && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="px-4 py-2 bg-gray-950/50 border-t border-gray-800 text-center">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] font-bold text-gray-500 hover:text-amber-400 transition-colors uppercase tracking-widest"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
