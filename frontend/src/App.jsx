import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ChefDashboard from './pages/ChefDashboard';
import AddItems from './pages/AddItems';
import SellerDashboard from './pages/SellerDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminFoods from './pages/AdminFoods';
import Chefs from './pages/Chefs';
import DietMeals from './pages/DietMeals';
import SystemAdminDashboard from './pages/SystemAdminDashboard';
import Approvals from './pages/Approvals';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import ContactAdmin from './pages/ContactAdmin';
import Blocked from './pages/Blocked';
import AllUsers from './pages/AllUsers';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './components/route/PrivateRoute';
import SellerRoute from './components/route/SellerRoute';
import AuthRoute from './components/route/AuthRoute';

// Placeholder Pages
const Dashboard = () => <div className="min-h-screen pt-20 px-8"><h1 className="text-3xl font-bold">User Dashboard</h1></div>;

function App() {
  const location = useLocation();
  const hideFooterFromPaths = ['/signup', '/login', '/admin/login'];
  const hideFooter = hideFooterFromPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact-admin" element={<ContactAdmin />} />
          <Route path="/blocked" element={<Blocked />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Routes (Require Login) */}
          <Route path="/browse" element={<AuthRoute><Browse /></AuthRoute>} />
          <Route path="/cart" element={<AuthRoute><Cart /></AuthRoute>} />
          <Route path="/chefs" element={<AuthRoute><Chefs /></AuthRoute>} />
          <Route path="/diet-meals" element={<AuthRoute><DietMeals /></AuthRoute>} />
          <Route path="/profile" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/checkout" element={<AuthRoute><Checkout /></AuthRoute>} />
          <Route path="/orders" element={<AuthRoute><Orders /></AuthRoute>} />
          
          {/* Seller Routes (Require Login + Seller Role) */}
          <Route path="/chef/dashboard" element={<SellerRoute><ChefDashboard /></SellerRoute>} />
          <Route path="/add-items" element={<SellerRoute><AddItems /></SellerRoute>} />
          
          {/* Admin Routes (Require Login + Passcode Gate) */}
          <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
          <Route path="/admin/users" element={<SellerRoute><AllUsers /></SellerRoute>} />
          <Route path="/admin/system" element={<AuthRoute><PrivateRoute><SystemAdminDashboard /></PrivateRoute></AuthRoute>} />
          <Route path="/admin/approvals" element={<AuthRoute><PrivateRoute><Approvals /></PrivateRoute></AuthRoute>} />
          <Route path="/admin/orders" element={<AuthRoute><PrivateRoute><AdminOrders /></PrivateRoute></AuthRoute>} />
          <Route path="/admin/foods" element={<AuthRoute><PrivateRoute><AdminFoods /></PrivateRoute></AuthRoute>} />
          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
