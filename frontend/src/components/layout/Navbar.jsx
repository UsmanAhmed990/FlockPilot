import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { ShoppingBag, User, Users, LogOut, Menu, X, ChefHat, Shield, Plus, Activity, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';
import AdminNotificationMenu from './AdminNotificationMenu';
import socket from '../../utils/socket';
import axios from '../../utils/axios';
import './Navbar.css';







const Navbar = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);

  const fetchAdminUnread = async () => {
    if (isAuthenticated && user?.role === 'admin') {
      try {
        const { data } = await axios.get('/api/admin-notifications');
        if (data.success) {
          setAdminUnreadCount(data.notifications.filter(n => !n.isRead).length);
        }
      } catch (err) {
        console.error('Error fetching admin unread count:', err);
      }
    }
  };

  useEffect(() => {
    fetchAdminUnread();

    if (isAuthenticated && user?.role === 'admin') {
      socket.on('adminNotification', () => {
        setAdminUnreadCount(prev => prev + 1);
      });

      socket.on('adminNotificationsRead', () => {
        setAdminUnreadCount(0);
      });

      return () => {
        socket.off('adminNotification');
        socket.off('adminNotificationsRead');
      };
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black text-white border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link id='flock'
            to="/"
            className="flock-p text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            FlockPilot
          </Link>

          {/* Desktop Menu */}
          <div className="navlinks-gap hidden md:flex items-center gap-8">
            <Link style={{ fontWeight: 'bold' }} className="nav-link hover:text-amber-400 transition" to="/browse">Shop</Link>














            {/* Cart */}
            <Link to="/cart" className="relative group">
              <ShoppingBag className="w-6 h-6 text-white group-hover:text-amber-400 transition" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>







 {/* SELLER ACCESS (Public for sellers/admins) */}
            {isAuthenticated && (user.role === 'seller' || user.role === 'chef' || user.role === 'admin') && (
              <div className="relative group">
                <button className="seller-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold border border-gray-800 hover:border-amber-500/50 transition-all group/seller shadow-lg">
                  <ChefHat className="w-4 h-4 text-amber-500" />
                  <span>Seller Access</span>
                </button>
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden backdrop-blur-md">
                    <div className="px-4 py-3 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest flex items-center justify-between">
                        Marketplace Tools
                        <Package size={12} />
                    </div>
                    <div className="p-1.5">
                        <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 hover:text-amber-400 rounded-xl transition-all group/item" to="/add-items">
                            <Plus className="w-4 h-4" /> <span className="font-bold">Add New Products</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-amber-500/10 hover:text-amber-500 rounded-xl transition-all font-bold group/admin" to="/seller/dashboard">
                      <Shield className="w-4 h-4 text-amber-500" /> Platform Overview
                    </Link>
                    </div>
                </div>
              </div>
            )}










            {/* Seller Dashboard */}



            {/* {isAuthenticated && user && (user.role === 'seller' || user.role === 'chef') && (
              <Link to="/chef/dashboard" className="flex items-center gap-2 font-bold text-amber-400 hover:text-amber-300 transition">
                <ChefHat className="w-5 h-5" />
                Seller Dashboard
              </Link>
            )} */}




            

            {/* Notifications */}
            {isAuthenticated && user?.role === 'admin' ? (
              <AdminNotificationMenu />
            ) : (
              <NotificationBell />
            )}




          

           

            {!isAuthenticated && (
            <div className="relative group">
              <Link id='admin-btn'
                to={sessionStorage.getItem('admin_passcode') ? "/admin/system" : "/admin/login"}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shadow-lg border ${sessionStorage.getItem('admin_passcode') ? 'bg-amber-500 text-black border-amber-600' : 'bg-gray-900 text-amber-500 border-gray-800 hover:border-red-500/50'}`}
              >
                <div className="relative">
                  <Shield className={`w-4 h-4 ${sessionStorage.getItem('admin_passcode') ? 'text-black' : 'text-red-500 animate-pulse'}`} />
                  {adminUnreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-black text-white shadow-[0_0_10px_rgba(220,38,38,0.5)] border border-black animate-bounce">
                      {adminUnreadCount}
                    </span>
                  )}
                </div>
                <span style={{fontWeight:'800'}} className="font-black text-md">
                  {sessionStorage.getItem('admin_passcode') ? 'Admin Panel' : 'Admin Access'}
                </span>
              </Link>

              {sessionStorage.getItem('admin_passcode') && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden backdrop-blur-md">
                  <div className="px-4 py-4 bg-gradient-to-r from-red-600 to-amber-600 text-white flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Platform Master</p>
                      <p className="text-xs font-bold font-mono">SECURE CONSOLE</p>
                    </div>
                    <button 
                      onClick={() => {
                        sessionStorage.removeItem('admin_passcode');
                        window.location.reload();
                      }}
                      className="p-1 px-2 rounded-lg bg-black/20 hover:bg-black uppercase text-[10px] font-black transition"
                    >
                      Lock
                    </button>
                  </div>
                  
                  <div className="p-1.5 pt-3">
                    <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-bold group/admin" to="/admin/system">
                      <Activity className="w-4 h-4 text-red-500" /> Administrative System
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-amber-500/10 hover:text-amber-500 rounded-xl transition-all font-bold group/admin" to="/admin/approvals">
                      <Users className="w-4 h-4 text-amber-500" /> Seller Approvals
                    </Link>
                    
                  </div>
                </div>
              )}
            </div>
            )}
          </div>

  {/* User Auth & Greeting */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="login-btn text-white font-bold hover:text-amber-400 transition">Login</Link>
                <Link to="/signup" className=" signup-btn px-5 py-2 rounded-full text-black font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 hover:scale-105 transition-all shadow-lg active:scale-95">Signup</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
              <div className="oldham-grret over-btn flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-2xl border border-gray-800 shadow-2xl relative group/user">
  
  <div className="over-p user-show w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover/user:rotate-12 transition-transform">
    {user.name?.split(" ")[0]?.charAt(0).toUpperCase()}
  </div>

  <div className="flex flex-col -space-y-0.5">
    
    {/* First Name in CamelCase */}
    <span className="over-p text-xs font-black text-white tracking-tight group-hover/user:text-amber-400 transition-colors">
      {user.name
        ?.split(" ")[0]                         // first name
        ?.toLowerCase()                        // all small
        ?.replace(/^./, c => c.toUpperCase())  // first letter capital
      }
    </span>

    <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover/user:text-amber-600 transition-colors">
      ({user.role})
    </span>

  </div>
</div>





                

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all duration-300 group/logout shadow-lg"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform" />
                </button>
              </div>
            )}




          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 shadow-lg text-white max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-1 px-4 py-4">
            <MobileLink to="/browse" onClick={setIsMenuOpen} icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}>Shop</MobileLink>
            <MobileLink to="/cart" onClick={setIsMenuOpen} icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}>Cart ({cartItems.length})</MobileLink>

            {/* Notifications in Mobile */}
            {/* <div className="px-4 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Notifications</p>
              {isAuthenticated && user?.role === 'admin' ? (
                <AdminNotificationMenu />
              ) : (
                <NotificationBell />
              )}
            </div> */}

            {/* SELLER ACCESS (Mobile) */}
            {isAuthenticated && (user.role === 'seller' || user.role === 'chef' || user.role === 'admin') && (
              <div style={{color:"white"}} className="px-4 py-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Seller Tools</p>
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/add-items" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm font-bold"
                  >
                    <Plus className="w-4 h-4 text-amber-500 " /> Add New Products
                  </Link>
                  <Link 
                    to="/seller/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm font-bold"
                  >
                    <Shield className="w-4 h-4 text-amber-500" /> Platform Overview
                  </Link>
                </div>
              </div>
            )}

            {/* ADMIN ACCESS (Mobile) */}
            {!isAuthenticated && (
            <div className="px-4 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">System Admin</p>
              <Link 
                to={sessionStorage.getItem('admin_passcode') ? "/admin/system" : "/admin/login"}
                onClick={() => setIsMenuOpen(false)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border ${sessionStorage.getItem('admin_passcode') ? 'bg-amber-500 text-black border-amber-600' : 'bg-gray-900 text-amber-500 border-gray-800'}`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4" />
                  <span className="font-bold text-sm">
                    {sessionStorage.getItem('admin_passcode') ? 'Admin Panel Active' : 'Admin Access'}
                  </span>
                </div>
              </Link>
              
              {sessionStorage.getItem('admin_passcode') && (
                <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-amber-500">
                  <Link className="flex items-center gap-3 p-2 text-sm text-gray-300 font-bold" to="/admin/system" onClick={() => setIsMenuOpen(false)}>
                    <Activity className="w-4 h-4 text-red-500" /> Administrative System
                  </Link>
                  <Link className="flex items-center gap-3 p-2 text-sm text-gray-300 font-bold" to="/admin/approvals" onClick={() => setIsMenuOpen(false)}>
                    <Users className="w-4 h-4 text-amber-500" /> Seller Approvals
                  </Link>
                  <button 
                    onClick={() => {
                      sessionStorage.removeItem('admin_passcode');
                      window.location.reload();
                    }}
                    className="text-left p-2 text-xs font-black text-red-500 uppercase"
                  >
                    Lock Console
                  </button>
                </div>
              )}
            </div>
            )}

            <div className="h-px bg-gray-800 my-2 mx-4"></div>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-4 px-4 py-2">
                {/* <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl border border-gray-700 font-bold text-white hover:text-amber-400 transition"
                >
                  Login
                </Link> */}
                {/* <Link 
                  to="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl bg-amber-500 font-bold text-black hover:bg-amber-600 transition"
                >
                  Sign Up
                </Link> */}
              </div>
            ) : (
              <div className="px-4 py-2">
                
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

/* Mobile Link Component */
const MobileLink = ({ to, children, onClick, icon }) => (
  <Link
    to={to}
    onClick={() => onClick(false)}
    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-amber-600 hover:text-black transition-all duration-200"
  >
    <span>{icon}</span>
    <span className="font-semibold">{children}</span>
  </Link>
);

export default Navbar;