import { useState, useEffect, useRef } from 'react';
import { Bell, Shield, ChefHat, UserPlus, Package, Clock, ShoppingCart, LogIn, ChevronRight } from 'lucide-react';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';

const AdminNotificationMenu = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [sellerNotifications, setSellerNotifications] = useState([]);
    const [adminNotifications, setAdminNotifications] = useState([]);
    const [unreadSeller, setUnreadSeller] = useState(0);
    const [unreadAdmin, setUnreadAdmin] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null); // 'seller' or 'admin'
    const dropdownRef = useRef(null);

    const fetchData = async () => {
        if (!isAuthenticated || user.role !== 'admin') return;
        try {
            // Fetch Seller/Order Notifications
            const sellerRes = await axios.get('/api/notifications');
            if (sellerRes.data.success) {
                setSellerNotifications(sellerRes.data.notifications);
                setUnreadSeller(sellerRes.data.notifications.filter(n => !n.isRead).length);
            }

            // Fetch Admin/System Notifications
            const adminRes = await axios.get('/api/admin-notifications');
            if (adminRes.data.success) {
                setAdminNotifications(adminRes.data.notifications);
                setUnreadAdmin(adminRes.data.notifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching dual notifications:', error);
        }
    };

    const markSellerAsRead = async () => {
        try {
            await axios.put('/api/notifications/mark-as-read');
            setUnreadSeller(0);
            setSellerNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking seller notifications read:', error);
        }
    };

    const markAdminAsRead = async () => {
        try {
            await axios.put('/api/admin-notifications/mark-as-read');
            setUnreadAdmin(0);
            setAdminNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking admin notifications read:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user.role === 'admin') {
            fetchData();
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setActiveTab(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalUnread = unreadSeller + unreadAdmin;

    const getAdminIcon = (type) => {
        switch (type) {
            case 'signup': return <UserPlus size={14} className="text-blue-400" />;
            case 'login': return <LogIn size={14} className="text-green-400" />;
            case 'product': return <Package size={14} className="text-amber-400" />;
            case 'order': return <ShoppingCart size={14} className="text-purple-400" />;
            default: return <Bell size={14} className="text-gray-400" />;
        }
    };

    if (!isAuthenticated || user.role !== 'admin') return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-amber-400 transition-colors focus:outline-none bg-gray-900 rounded-full border border-gray-800"
            >
                <Bell size={20} />
                {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-lg animate-pulse">
                        {totalUnread}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Admin Control</h3>
                    </div>

                    <div className="p-2 space-y-1">
                        {/* ITEM 1: Sellers Notifications */}
                        <button 
                            onClick={() => {
                                setActiveTab(activeTab === 'seller' ? null : 'seller');
                                if (unreadSeller > 0) markSellerAsRead();
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'seller' ? 'bg-amber-500 text-black' : 'text-gray-300 hover:bg-gray-800'}`}
                        >
                            <div className="flex items-center gap-3">
                                <ChefHat size={18} />
                                <span className="font-bold text-sm">Sellers Notifications</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadSeller > 0 && activeTab !== 'seller' && (
                                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadSeller}</span>
                                )}
                                <ChevronRight size={14} className={`transform transition-transform ${activeTab === 'seller' ? 'rotate-90' : ''}`} />
                            </div>
                        </button>

                        {activeTab === 'seller' && (
                            <div className="mt-1 mb-2 max-h-60 overflow-y-auto custom-scrollbar border-l-2 border-amber-500 ml-4 pl-2 space-y-2 py-2">
                                {sellerNotifications.length === 0 ? (
                                    <p className="text-[10px] text-gray-600 p-2 italic">No order updates</p>
                                ) : (
                                    sellerNotifications.map(n => (
                                        <div key={n._id} className="p-2 rounded-lg bg-gray-900/50">
                                            <p className="text-[11px] font-medium text-gray-300">{n.message}</p>
                                            <p className="text-[9px] text-gray-600 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* ITEM 2: Admins Notifications */}
                        <button 
                            onClick={() => {
                                setActiveTab(activeTab === 'admin' ? null : 'admin');
                                if (unreadAdmin > 0) markAdminAsRead();
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'admin' ? 'bg-amber-500 text-black' : 'text-gray-300 hover:bg-gray-800'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={18} />
                                <span className="font-bold text-sm">Admins Notifications</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadAdmin > 0 && activeTab !== 'admin' && (
                                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadAdmin}</span>
                                )}
                                <ChevronRight size={14} className={`transform transition-transform ${activeTab === 'admin' ? 'rotate-90' : ''}`} />
                            </div>
                        </button>

                        {activeTab === 'admin' && (
                            <div className="mt-1 mb-2 max-h-60 overflow-y-auto custom-scrollbar border-l-2 border-amber-500 ml-4 pl-2 space-y-2 py-2">
                                {adminNotifications.length === 0 ? (
                                    <p className="text-[10px] text-gray-600 p-2 italic">No system updates</p>
                                ) : (
                                    adminNotifications.map(n => (
                                        <div key={n._id} className="p-2 rounded-lg bg-gray-900/50 flex gap-2">
                                            <div className="mt-0.5">{getAdminIcon(n.type)}</div>
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-300">{n.message}</p>
                                                <p className="text-[9px] text-gray-600 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-800 text-center">
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter italic">Dual System Link Active</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotificationMenu;
