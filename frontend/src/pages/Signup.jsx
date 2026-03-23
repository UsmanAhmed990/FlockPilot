import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearErrors } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ChefHat, UserPlus, Phone, Shield } from 'lucide-react';
import "./signup.css"

const Signup = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        role: 'buyer'
    });
    const [certificate, setCertificate] = useState(null);

    const { name, email, phone, password, address, role } = user;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }
    }, [dispatch, isAuthenticated, error, navigate]);

    const registerDataChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email.toLowerCase());
        formData.append('phone', phone);
        formData.append('password', password);
        formData.append('role', role);
        if (address) formData.append('address', address);
        if (certificate) formData.append('certificate', certificate);

        dispatch(register(formData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-amber-200 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-amber-300 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10 animate-scale-in">
                {/* Card */}
               <div className="login-box bg-black/90 p-10 rounded-2xl shadow-2xl border border-amber-600">
  {/* Header */}
  <div className="text-center mb-8">
    <div className="login-bbx inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl mb-4 shadow-lg">
      <UserPlus className="w-8 h-8 text-white" />
    </div>
    <h2 className="texter text-3xl font-bold text-white uppercase italic tracking-tighter">
      {role === 'seller' ? 'Seller Hub Registration' : 'Join FlockPilot'}
    </h2>
    <p className="mt-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
        {role === 'seller' ? 'Setup your poultry business profile' : 'Create your buyer account in seconds'}
    </p>
  </div>

  {/* Form */}
  <form className="space-y-4" onSubmit={submitHandler}>
    {/* Role Selection */}
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        <button id='btn1'
          type="button"
          onClick={() => setUser({ ...user, role: 'buyer' })}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            role === 'buyer'
              ? 'border-amber-600 bg-amber-500 shadow-md text-black'
              : 'border-gray-800 hover:border-amber-400 text-white'
          }`}
        >
          <User className={`w-6 h-6 mx-auto mb-2 ${role === 'buyer' ? 'text-black' : 'text-amber-400'}`} />
          <div className={`text-[10px] font-black uppercase tracking-widest ${role === 'buyer' ? 'text-black' : 'text-white'}`}>
            Buy Poultry
          </div>
        </button>
        <button id='btn2'
          type="button"
          onClick={() => setUser({ ...user, role: 'seller' })}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            role === 'seller'
              ? 'border-amber-700 bg-amber-600 shadow-md text-black'
              : 'border-gray-800 hover:border-amber-400 text-white'
          }`}
        >
          <ChefHat className={`w-6 h-6 mx-auto mb-2 ${role === 'seller' ? 'text-black' : 'text-amber-400'}`} />
          <div className={`text-[10px] font-black uppercase tracking-widest ${role === 'seller' ? 'text-black' : 'text-white'}`}>
            Sell Poultry
          </div>
        </button>
      </div>
    </div>

    {/* Shop Name (Seller Only) */}
    {role === 'seller' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 ml-1">
                Shop Name / Username
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserPlus className="h-4 w-4 text-amber-500/50" />
                </div>
                <input
                    type="text"
                    name="name"
                    required
                    className="inp1 w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl py-3 pl-11 pr-4 focus:border-amber-500/50 focus:ring-0 outline-none transition-all placeholder:text-zinc-700 font-bold"
                    placeholder="e.g. Ali Poultry Farm"
                    value={name}
                    onChange={registerDataChange}
                />
            </div>
        </div>
    )}

    {/* Email Field */}
    <div>
      <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 ml-1">
        Email Address
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Mail className="h-4 w-4 text-amber-500/50" />
        </div>
        <input
          type="email"
          name="email"
          required
          className="inp2 w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl py-3 pl-11 pr-4 focus:border-amber-500/50 focus:ring-0 outline-none transition-all placeholder:text-zinc-700 font-bold"
          placeholder="you@example.com"
          value={email}
          onChange={registerDataChange}
        />
      </div>
    </div>

    {/* Password Field */}
    <div>
      <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 ml-1">
        Password
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock className="h-4 w-4 text-amber-500/50" />
        </div>
        <input
          type="password"
          name="password"
          required
          className="inp3 w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl py-3 pl-11 pr-4 focus:border-amber-500/50 focus:ring-0 outline-none transition-all placeholder:text-zinc-700 font-bold"
          placeholder="••••••••"
          value={password}
          onChange={registerDataChange}
        />
      </div>
    </div>

    {/* Phone Field */}
    <div>
      <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 ml-1">
        Contact Number
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Phone className="h-4 w-4 text-amber-500/50" />
        </div>
        <input
          type="text"
          name="phone"
          required
          className="inp4 w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl py-3 pl-11 pr-4 focus:border-amber-500/50 focus:ring-0 outline-none transition-all placeholder:text-zinc-700 font-bold"
          placeholder="+92 300 1234567"
          value={phone}
          onChange={registerDataChange}
        />
      </div>
    </div>

    {/* Shop Address (Seller Only) */}
    {role === 'seller' && (
         <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 ml-1">
                Shop / Business Address
            </label>
            <textarea
                name="address"
                required
                rows="2"
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl py-3 px-4 focus:border-amber-500/50 focus:ring-0 outline-none transition-all placeholder:text-zinc-700 font-bold resize-none"
                placeholder="Full address of your shop or farm..."
                value={address}
                onChange={registerDataChange}
            ></textarea>
        </div>
    )}

    {/* Certificate Upload (Seller Only) */}
    {role === 'seller' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 ml-1">
                Upload Verified Certificate-Letter (Image or PDF)
            </label>
            <div className="relative">
                <input
                    type="file"
                    name="certificate"
                    required
                    accept="image/*,application/pdf"
                    onChange={(e) => setCertificate(e.target.files[0])}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl py-3 px-4 focus:border-amber-500/50 focus:ring-0 outline-none transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-amber-500 file:text-black hover:file:bg-amber-600"
                />
            </div>
        </div>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="btn-signup w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 bg-gradient-to-r from-amber-500 to-amber-700 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all active:scale-95"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          CREATING...
        </>
      ) : (
        <>
          <UserPlus className="w-5 h-5" />
          {role === 'seller' ? 'START SELLING' : 'CREATE ACCOUNT'}
        </>
      )}
    </button>
  </form>
</div>

                {/* Bottom Text */}
                <p className="p-ft text-center text-sm text-gray-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Signup;
