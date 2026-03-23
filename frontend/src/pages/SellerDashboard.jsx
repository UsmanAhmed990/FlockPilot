import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import socket from '../utils/socket';
import { Package, DollarSign, Users, Clock, Shield, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import AdminNotificationBell from '../components/layout/AdminNotificationBell';
import NotificationBell from '../components/layout/NotificationBell';
import { useSelector } from 'react-redux';
import './sellerdashboard.css';


const SellerDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        pendingOrders: 0
    });


    const [recentOrders, setRecentOrders] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedScreenshot, setSelectedScreenshot] = useState(null);
    const { user: currentUser } = useSelector(state => state.auth);

    useEffect(() => {
        if (!currentUser) return;

        fetchDashboardData();

        // Join room for real-time dashboard updates
        socket.emit('join', currentUser._id);

        socket.on('newOrder', (newOrder) => {
            setStats(prev => ({
                ...prev,
                totalOrders: prev.totalOrders + 1,
                pendingOrders: prev.pendingOrders + 1
            }));

            setRecentOrders(prev => [newOrder, ...prev].slice(0, 5));
        });

        return () => {
            socket.off('newOrder');
        };

    }, [currentUser]);


    const fetchDashboardData = async () => {

        try {

            const ordersEndpoint = currentUser?.role === 'admin' ? '/api/order/admin/all' : '/api/order/chef';
            const usersEndpoint = currentUser?.role === 'admin' ? '/api/auth/admin/all' : null;

            const [ordersRes, usersRes, allUsersRes] = await Promise.all([
                axios.get(ordersEndpoint),
                usersEndpoint ? axios.get(usersEndpoint) : Promise.resolve({ data: { users: [] } }),
                currentUser?.role === 'admin' ? axios.get('/api/admin/all-users') : Promise.resolve({ data: { users: [] } })
            ]);

            const orders = ordersRes.data.orders || [];
            const users = usersRes.data.users || [];
            const allUsers = allUsersRes.data.users || [];

            setStats({
                totalOrders: orders.length,
                totalRevenue: orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.totalAmount, 0),
                totalUsers: currentUser?.role === 'admin' ? users.length : [...new Set(orders.map(o => o.user?._id || o.user))].length,
                pendingOrders: orders.filter(o => o.status === 'Pending').length
            });

            setRecentOrders(orders.slice(0, 5));
            setAllUsers(allUsers);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };


    const updateOrderStatus = async (orderId, newStatus) => {

        try {

            const orderToUpdate = recentOrders.find(o => o._id === orderId);
            if (!orderToUpdate) return;
            const previousStatus = orderToUpdate.status;

            // map 'Undelivered' to 'Pending' for backend compatibility, or just send newStatus
            const backendStatus = newStatus === 'Undelivered' ? 'Pending' : newStatus;

            await axios.put(`/api/order/${orderId}`, { status: backendStatus });

            setRecentOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? { ...o, status: backendStatus } : o
                )
            );

            // Update Real-Time Revenue and Stats
            setStats(prev => {
                let newRevenue = prev.totalRevenue;
                let newPending = prev.pendingOrders;

                if (previousStatus === 'Delivered' && backendStatus === 'Pending') {
                    // Changed from Delivered -> Undelivered (Pending)
                    newRevenue -= orderToUpdate.totalAmount;
                    newPending += 1;
                } else if (previousStatus !== 'Delivered' && backendStatus === 'Delivered') {
                    // Changed from Undelivered/Pending -> Delivered
                    newRevenue += orderToUpdate.totalAmount;
                    newPending = newPending > 0 ? newPending - 1 : 0;
                }

                return {
                    ...prev,
                    totalRevenue: newRevenue,
                    pendingOrders: newPending
                };
            });

        } catch (err) {

            console.error('Status update failed', err);

        }

    };

    const verifyPayment = async (orderId) => {

        const amount = prompt("Enter verified amount (Rs):");
        if (!amount) return;

        try {

            const { data } = await axios.put(`/api/order/verify/${orderId}`, { paidAmount: amount });

            setRecentOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? data.order : o
                )
            );

            alert('Payment Verified Successfully!');

        } catch (err) {

            console.error('Payment verification failed', err);
            alert('Failed to verify payment');

        }

    };

    const rejectPayment = async (orderId) => {

        if (!window.confirm('Are you sure you want to REJECT this payment?')) return;

        try {

            const { data } = await axios.put(`/api/order/reject/${orderId}`);

            setRecentOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? data.order : o
                )
            );

        } catch (err) {

            console.error('Payment rejection failed', err);
            alert('Failed to reject payment');

        }

    };

    const handleUserStatus = async (userId, action) => {
        try {
            await axios.put(`/api/admin/${action}-seller/${userId}`);
            
            // Update local state
            setAllUsers(prev => prev.map(u => 
                u._id === userId 
                ? { ...u, verificationStatus: action === 'approve' ? 'approved' : 'rejected', isVerified: action === 'approve' } 
                : u
            ));
            
            alert(`User status updated to ${action}ed!`);
        } catch (err) {
            console.error('Failed to update user status', err);
            alert('Operation failed');
        }
    };


    if (loading) {

        return (
            <div className="use min-h-screen flex items-center justify-center bg-black">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    }

    return (

        <div className="mai-seller  min-h-screen bg-black text-white py-10">

            <div className="max-w-7xl mx-auto px-4">
                {/* HEADER NAV */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-800 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-6 h-6 text-amber-500" />
                            <h1 className="sellerh1 text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                Seller Dashboard
                            </h1>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Manage orders & monitor activity
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentUser?.role === 'admin' ? <AdminNotificationBell /> : <NotificationBell />}
                        <div className="h-10 w-px bg-gray-800 hidden md:block"></div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                {currentUser?.role === 'admin' ? 'Admin Access' : 'Seller Access'}
                            </p>
                            <p className="text-sm font-semibold text-amber-500">
                                {currentUser?.role === 'admin' ? 'System Control' : 'Store Control'}
                            </p>
                        </div>
                    </div>
                </div>


                {/* STATS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                    {[
                        { label: 'Total Orders', value: stats.totalOrders, icon: Package },
                        { label: 'Revenue', value: `Rs. ${stats.totalRevenue}`, icon: DollarSign },
                        { label: 'Users', value: stats.totalUsers, icon: Users, link: '/admin/users' },
                        { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock }

                    ].map((s, i) => (

                        s.link && currentUser?.role === 'admin' ? (
                            <div 
                                key={i} 
                                onClick={() => navigate(s.link)}
                                className="pend1 bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-amber-500 transition cursor-pointer group shadow-xl hover:shadow-amber-500/10"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-400 group-hover:text-amber-500 transition-colors uppercase font-black tracking-widest text-[10px]">{s.label}</p>
                                        <p className="text-3xl font-bold mt-1 text-amber-400">{s.value}</p>
                                    </div>
                                    <s.icon className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="pend2 mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Click to Manage</span>
                                    <ChevronRight size={14} className="text-gray-600 group-hover:text-amber-500 transition-colors" />
                                </div>
                            </div>
                        ) : (
                            <div key={i} className="pend1 bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-amber-500 transition">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase font-black tracking-widest text-[10px]">{s.label}</p>
                                        <p className="text-3xl font-bold mt-1 text-amber-400">{s.value}</p>
                                    </div>
                                    <s.icon className="w-8 h-8 text-amber-500" />
                                </div>
                            </div>
                        )

                    ))}

                </div>




                {/* ORDERS TABLE */}

                <div className="pend2 bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-x-auto">

                    <h2 className="text-2xl font-bold mb-6 text-amber-400">
                        Recent Orders
                    </h2>

                    {recentOrders.length === 0 ? (

                        <p className="text-center text-gray-400 py-10">
                            No orders yet
                        </p>

                    ) : (

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="border-b border-gray-700 text-gray-400">

                                    <th className="py-3 text-left">Order</th>
                                    <th className="py-3 text-left">Customer</th>
                                    <th className="py-3 text-left">Amount</th>
                                    <th className="py-3 text-left">Payment</th>
                                    <th className="py-3 text-left">Status</th>
                                    <th className="py-3 text-left">Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {recentOrders.map(order => (

                                    <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/40 transition">

                                        <td className="py-4 font-mono text-amber-400">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>

                                        <td className="py-4">

                                            <div className="font-medium">
                                                {order.customerName || 'Guest'}
                                            </div>

                                            <div className="text-xs text-gray-400">
                                                {order.customerEmail}
                                            </div>

                                            <div className="text-xs mt-1 text-gray-300">
                                                📞 {order.customerPhone || order.deliveryAddress?.phone || 'N/A'}
                                            </div>

                                            {/* <div className="text-xs text-gray-500">
                                                📍 {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                                            </div> */}

                                        </td>

                                        <td className="py-4 font-bold text-amber-400">
                                            Rs. {order.totalAmount}
                                        </td>


                                        <td className="py-4">

                                            <div className="font-semibold text-sm mb-1">
                                                {order.paymentMethod}
                                            </div>

                                            <span className={`text-xs px-2 py-1 rounded ${
                                                order.paymentStatus === 'BILL PAID ONLINE'
                                                ? 'bg-green-600/20 text-green-400'
                                                : order.paymentStatus === 'PAYMENT REJECTED'
                                                ? 'bg-red-600/20 text-red-400'
                                                : 'bg-yellow-600/20 text-yellow-400'
                                            }`}>
                                                {order.paymentStatus}
                                            </span>


                                            {order.paymentScreenshot && (

                                                <button
                                                    onClick={() => setSelectedScreenshot((import.meta.env.VITE_API_URL || 'http://localhost:5020') + order.paymentScreenshot)}
                                                    className="block text-xs text-amber-400 underline mt-2"
                                                >
                                                    View Proof
                                                </button>

                                            )}

                                        </td>


                                        <td className="py-4">

                                            <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                                                order.status === 'Delivered'
                                                ? 'bg-green-600/20 text-white-400'
                                                : 'bg-yellow-600/20 text-yellow-400'
                                            }`}>
                                                {order.status}
                                            </span>

                                        </td>


                                        <td className="py-4 space-y-2">

                                            {order.status !== 'Delivered' && (

                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                                    className="w-full px-3 py-1 text-xs font-bold rounded bg-amber-600 hover:bg-green-700 text-white"
                                                >
                                                    Mark Done
                                                </button>

                                            )}

                                            {order.status === 'Delivered' && (

                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'Undelivered')}
                                                    className="w-full px-3 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    Undelivered
                                                </button>

                                            )}

                                            {order.paymentMethod === 'Online' &&
                                             order.paymentStatus !== 'BILL PAID ONLINE' &&
                                             order.paymentStatus !== 'PAYMENT REJECTED' && (

                                                <div className="flex flex-col gap-2">

                                                    <button
                                                        onClick={() => verifyPayment(order._id)}
                                                        className="px-3 py-1 text-xs font-bold rounded bg-amber-500 hover:bg-amber-600 text-black"
                                                    >
                                                        Verify
                                                    </button>

                                                    <button
                                                        onClick={() => rejectPayment(order._id)}
                                                        className="px-3 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </button>

                                                </div>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>



                {/* USER MANAGEMENT (Admin Only) */}
                {currentUser?.role === 'admin' && (
                    <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-x-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Users className="text-amber-500 w-8 h-8" />
                                <div>
                                    <h2 className="usersh2 text-2xl font-black text-amber-400 tracking-tight">
                                        User Management
                                    </h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Approve or Block Sellers</p>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <span className="text-amber-500 font-black text-xs uppercase tracking-widest">Total Users: {allUsers.length}</span>
                            </div>
                        </div>

                        {allUsers.length === 0 ? (
                            <p className="text-center text-gray-400 py-10 italic">No users found</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-500">
                                        <th className="py-4 text-left font-black uppercase tracking-widest text-[10px]">Name & Role</th>
                                        <th className="py-4 text-left font-black uppercase tracking-widest text-[10px]">Contact Info</th>
                                        <th className="py-4 text-left font-black uppercase tracking-widest text-[10px]">Status</th>
                                        <th className="py-4 text-right font-black uppercase tracking-widest text-[10px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map(u => (
                                        <tr key={u._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
                                            <td className="py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                                        u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 
                                                        u.role === 'seller' || u.role === 'chef' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                                                    }`}>
                                                        {u.name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-100">{u.name || 'N/A'}</p>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{u.role}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5">
                                                <p className="text-gray-300 font-medium">{u.email}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{u.phone || 'No phone'}</p>
                                            </td>
                                            <td className="py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    u.verificationStatus === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                    u.verificationStatus === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                                                }`}>
                                                    {u.verificationStatus || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-5 text-right">
                                                {u.role !== 'admin' && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        {u.verificationStatus !== 'approved' && (
                                                            <button 
                                                                onClick={() => handleUserStatus(u._id, 'approve')}
                                                                className="p-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg active:scale-90"
                                                                title="Approve User"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                        )}
                                                        {u.verificationStatus !== 'rejected' && (
                                                            <button 
                                                                onClick={() => handleUserStatus(u._id, 'reject')}
                                                                className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                                                                title="Block User"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* SCREENSHOT MODAL */}

                {selectedScreenshot && (

                    <div
                        className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedScreenshot(null)}
                    >

                        <div className="max-w-4xl w-full relative">

                            <button
                                onClick={() => setSelectedScreenshot(null)}
                                className="absolute -top-10 right-0 text-white text-xl"
                            >
                                ✕
                            </button>

                            <img
                                src={selectedScreenshot}
                                className="w-full rounded-xl border border-gray-700"
                            />

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default SellerDashboard;