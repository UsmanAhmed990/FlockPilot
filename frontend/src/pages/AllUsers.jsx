import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Users, Search, Filter, ChevronLeft, ChevronRight, CheckCircle, XCircle, Shield, Mail, Phone, Calendar, Ban, LogIn, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './users.css';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [pagination.currentPage, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/admin/all-users?page=${pagination.currentPage}&limit=10&role=${roleFilter}`);
            setUsers(data.users);
            setPagination(prev => ({
                ...prev,
                totalPages: data.totalPages,
                totalUsers: data.totalUsers
            }));
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUserStatus = async (userId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
        try {
            const endpoint = action === 'block' ? `/api/admin/block-user/${userId}` : `/api/admin/${action}-seller/${userId}`;
            await axios.put(endpoint);
            
            setUsers(prev => prev.map(u => 
                u._id === userId 
                ? { ...u, verificationStatus: action === 'block' || action === 'reject' ? 'rejected' : 'approved', isVerified: action === 'approve' } 
                : u
            ));
            alert(`User successfully ${action === 'block' ? 'blocked' : action + 'ed'}!`);
        } catch (err) {
            console.error('Operation failed', err);
            alert('Operation failed');
        }
    };

    const handleImpersonate = (seller) => {
        if (!window.confirm(`Login to ${seller.name || seller.email}'s account?`)) return;
        // Save current user for potential logout/switch back
        localStorage.setItem('user', JSON.stringify(seller));
        // Redirect to seller dashboard
        window.location.href = '/seller/dashboard';
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="use-main min-h-screen bg-black text-white py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-amber-500/10 rounded-3xl border border-amber-500/20">
                            <Users className="text-amber-500 w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="userh1 text-4xl font-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent tracking-tight">
                                User Management
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
                                PLATFORM USERS OVERVIEW • {pagination.totalUsers} TOTAL
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className=" fill bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-6 mb-8 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <input 
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="fillinps w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-black border border-gray-800 rounded-2xl p-2 px-4">
                            <Filter className="text-gray-500" size={18} />
                            <select 
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                                }}
                                className="bg-transparent border-none text-gray-300 focus:outline-none font-bold text-sm uppercase tracking-widest cursor-pointer"
                            >
                               <option value="all" className="bg-black text-white">All Roles</option>
    <option value="seller" className="bg-black text-white">Sellers</option>
    <option value="buyer" className="bg-black text-white">Buyers</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-gray-900/40 border border-gray-800/60 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-950/80 border-b border-gray-800/50">
                                    <th className="  py-6 px-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Identity</th>
                                    <th className=" py-6 px-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Contact Info</th>
                                    <th className=" py-6 px-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Account Status</th>
                                    <th className=" py-6 px-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Member Since</th>
                                    <th className=" py-6 px-8 text-right text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-32 text-center">
                                            <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto relative">
                                                <div className="absolute inset-0 rounded-full blur-xl bg-amber-500/10 uppercase"></div>
                                            </div>
                                            <p className="mt-6 text-amber-500/60 font-black text-xs uppercase tracking-widest animate-pulse">Syncing Database...</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-32 text-center">
                                            <Users className="w-16 h-16 mx-auto mb-4 text-gray-800 opacity-20" />
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm italic">No users found matching your criteria</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.map(u => (
                                    <tr key={u._id} className="group hover:bg-gray-800/20 transition-all duration-300">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                                                    u.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                                    u.role === 'seller' || u.role === 'chef' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                }`}>
                                                    {u.name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="gg font-black text-gray-100 uppercase tracking-tight">{u.name || 'Anonymous'}</p>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2 py-0.5 bg-gray-950 rounded-lg">{u.role}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Mail size={14} className="text-gray-600" />
                                                    <span className="font-medium">{u.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Phone size={14} className="text-gray-600" />
                                                    <span className="text-xs">{u.phone || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                                                u.verificationStatus === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                u.verificationStatus === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                                {u.verificationStatus === 'approved' ? <Shield size={12} /> : null}
                                                {u.verificationStatus || 'Pending'}
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar size={14} />
                                                <span className="text-xs font-medium">{new Date(u.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            {u.role !== 'admin' && (
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {(u.role === 'seller' || u.role === 'chef') && (
                                                        <button 
                                                            onClick={() => handleImpersonate(u)}
                                                            className="p-3 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black transition-all shadow-xl active:scale-90 flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter"
                                                            title="Login to this Account"
                                                        >
                                                            <LogIn size={18} />
                                                            Login
                                                        </button>
                                                    )}
                                                    
                                                    {u.verificationStatus !== 'rejected' && (
                                                        <button 
                                                            onClick={() => handleUserStatus(u._id, 'block')}
                                                            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90 flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter"
                                                            title="Block User"
                                                        >
                                                            <Ban size={18} />
                                                            Block
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-8 border-t border-gray-800 bg-gray-950/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            Showing <span className="text-gray-100">{users.length}</span> of <span className="text-gray-100">{pagination.totalUsers}</span> registered users
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                disabled={pagination.currentPage === 1}
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            <div className="flex items-center gap-2">
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPagination(prev => ({ ...prev, currentPage: i + 1 }))}
                                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                                            pagination.currentPage === i + 1 
                                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                                            : 'bg-gray-900 text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                disabled={pagination.currentPage === pagination.totalPages}
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
