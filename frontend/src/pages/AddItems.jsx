import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Edit3, Trash2, X, Package, Tag, IndianRupee, FileText, Plus, Shield } from 'lucide-react';
import socket from '../utils/socket';
import "./add-items.css";

const AddItems = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Chicken'
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [editData, setEditData] = useState(null);
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            fetchMyMenu();
            fetchLatestProfile();
        }

        socket.on('verificationStatusUpdate', (data) => {
            console.log('Real-time verification update:', data);
            window.location.reload(); // Simple way to refresh state
        });

        return () => socket.off('verificationStatusUpdate');
    }, [user]);

    const [currentProfile, setCurrentProfile] = useState(null);

    const fetchLatestProfile = async () => {
        try {
            const { data } = await axios.get('/api/auth/me');
            setCurrentProfile(data.user);
        } catch (err) {
            console.error('Failed to fetch profile:', err);
        }
    };

    const fetchMyMenu = async () => {
        try {
            const { data } = await axios.get('/api/food/my-products');
            setFoods(data.foods);
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Delete this product? It will be permanently removed from the shop.')) {
            try {
                await axios.delete(`/api/food/${id}`);
                alert('Product removed from shop successfully!');
                fetchMyMenu();
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete product from shop.');
            }
        }
    };

    const handleUpdateClick = (food) => {
        setEditData({
            ...food,
            image: food.images && food.images[0] ? food.images[0] : ''
        });
        setIsUpdating(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/food/${editData._id}`, {
                ...editData,
                images: editData.image ? [editData.image] : editData.images
            });
            alert('Product updated successfully!');
            setIsUpdating(false);
            setEditData(null);
            fetchMyMenu();
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update product.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/food/add', {
                ...formData,
                userId: user?._id,
                images: formData.image ? [formData.image] : [],
                dietType: 'Regular'
            });
            alert('Item added successfully!');
            setFormData({
                name: '',
                price: '',
                description: '',
                image: '',
                category: 'Chicken'
            });
            await fetchMyMenu();
        } catch (error)
         {
            console.error('Error adding item', error);
            alert('Failed to add item: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full -top-40 -left-40"></div>
            <div className="absolute w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full -bottom-40 -right-40"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* VERIFICATION BANNER */}
                {currentProfile && (currentProfile.role === 'seller' || currentProfile.role === 'chef') && !currentProfile.isVerified && (
                    <div className={`mb-10 p-6 rounded-[2rem] border-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700 ${
                        currentProfile.verificationStatus === 'rejected' 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-amber-500/10 border-amber-500/30'
                    }`}>
                        <div className="flex items-center gap-5">
                            <div className={`p-4 rounded-2xl ${
                                currentProfile.verificationStatus === 'rejected' ? 'bg-red-500/20' : 'bg-amber-500/20'
                            }`}>
                                <Shield className={currentProfile.verificationStatus === 'rejected' ? 'text-red-500' : 'text-amber-500'} size={28} />
                            </div>
                            <div>
                                <h2 className={`text-xl font-black uppercase tracking-tight ${
                                    currentProfile.verificationStatus === 'rejected' ? 'text-red-400' : 'text-amber-400'
                                }`}>
                                    {currentProfile.verificationStatus === 'rejected' 
                                        ? 'Account Verification Rejected' 
                                        : 'Account Verification Pending'}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1 font-medium">
                                    {currentProfile.verificationStatus === 'rejected'
                                        ? 'Your application was not approved. Please contact support for more details.'
                                        : 'Your shop is currently being reviewed by our administration team. You can manage existing items but cannot publish new ones.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                    {/* ADD FORM */}
                    <div className="add-main bg-gray-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="add-plus p-3 bg-amber-500/10 rounded-2xl">
                                <Plus size={24} className="text-amber-500" />
                            </div>
                            <div>
                                <h1 className="add-h text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                    Add New Item
                                </h1>
                                <p className="add-p text-gray-500 text-sm font-medium">Create a new product listing</p>
                            </div>
                        </div>

                        {/* Add Form Content */}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Category</label>
                                    <div className="relative group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                        <select
                                            required
                                            className=" add-inps w-full bg-black border border-gray-800 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            <option value="Chicken">Raw Chicken</option>
                                            <option value="Wings">Wings</option>
                                            <option value="Eggs">Eggs</option>
                                            <option value="Meat">Cheast Pieces</option>
                                            <option value="Meat">Other Meat</option>
                                            <option value="Meat">Boneless Chicken</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Item Name</label>
                                    <div className="relative group">
                                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Premium Whole Chicken"
                                            className=" add-inps w-full bg-black border border-gray-800 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Price (Rs)</label>
                                    <div className="relative group">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                        <input
                                            type="number"
                                            required
                                            placeholder="850"
                                            className="add-inps w-full bg-black border border-gray-800 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Image URL</label>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            className="add-inps w-full bg-black border border-gray-800 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all"
                                            value={formData.image}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Describe the product quality and source..."
                                    className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>

                            <button id='add-btn'
                                type="submit"
                                disabled={currentProfile && (currentProfile.role === 'seller' || currentProfile.role === 'chef') && !currentProfile.isVerified}
                                className={`w-full font-black uppercase tracking-widest text-sm py-5 rounded-2xl hover:scale-[1.01] active:scale-95 transition-all duration-300 shadow-xl shadow-amber-500/20 ${
                                    currentProfile && (currentProfile.role === 'seller' || currentProfile.role === 'chef') && !currentProfile.isVerified
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                    : 'bg-gradient-to-r from-amber-400 to-amber-600 text-black'
                                }`}
                            >
                                {currentProfile && (currentProfile.role === 'seller' || currentProfile.role === 'chef') && !currentProfile.isVerified 
                                    ? 'Awaiting Verification...' 
                                    : 'Publish to Marketplace'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ITEMS HISTORY SECTION */}
                <div className="prest mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="hist text-3xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                Items History – Manage your active marketplace listings
                            </h2>
                            <p className="text-gray-500 text-sm font-medium mt-1">See what you are selling currently</p>
                        </div>
                        <div className="total-items bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl text-xs font-bold text-amber-500">
                            {foods.length} Total Items
                        </div>
                    </div>
                    
                    {foods.length === 0 ? (
                        <div className="presto text-center py-20 bg-gray-900/40 rounded-3xl border-2 border-dashed border-gray-800">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package size={24} className="text-gray-600" />
                            </div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                                No items found in history
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            {foods.map(food => (
                                <div 
                                    key={food._id}
                                    className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all group flex flex-col"
                                >
                                    {food.images && food.images[0] ? (
                                        <div className="h-44 overflow-hidden relative">
                                            <img
                                                src={food.images[0]}
                                                alt={food.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-amber-500 uppercase">
                                                {food.category}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-44 bg-gray-800 flex items-center justify-center">
                                            <Package size={32} className="text-gray-700" />
                                        </div>
                                    )}
                                    <div className="preston p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-black text-white group-hover:text-amber-400 transition-colors">
                                                {food.name}
                                            </h3>
                                        </div>
                                        <p className="text-gray-500 text-xs font-medium mb-6 line-clamp-2">
                                            {food.description}
                                        </p>
                                        
                                        <div className="mt-auto">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-black text-white">
                                                    Rs {food.price}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateClick(food)}
                                                        className="p-2.5 rounded-xl transition-all bg-gray-800 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10"
                                                        title="Update Item"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(food._id)}
                                                        className="p-2.5 rounded-xl transition-all bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                                        title="Delete Item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* UPDATE MODAL */}
            {isUpdating && editData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsUpdating(false)}></div>
                    <div className="relative bg-gray-900 border border-gray-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animte-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/10 rounded-2xl">
                                        <Edit3 size={20} className="text-amber-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white">Update Product</h2>
                                </div>
                                <button 
                                    onClick={() => setIsUpdating(false)}
                                    className="p-2 hover:bg-gray-800 rounded-full text-gray-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="add-inps w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                                            value={editData.name}
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Price (Rs)</label>
                                        <input
                                            type="number"
                                            required
                                            className="add-inps w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                                            value={editData.price}
                                            onChange={(e) => setEditData({...editData, price: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Category</label>
                                    <select
                                        required
                                        className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                                        value={editData.category}
                                        onChange={(e) => setEditData({...editData, category: e.target.value})}
                                    >
                                        <option value="Chicken">Raw Chicken</option>
                                        <option value="Wings">Wings</option>
                                        <option value="Eggs">Eggs</option>
                                        <option value="Meat">Cheast Pieces</option>
                                        <option value="Meat">Other Meat</option>
                                        <option value="Meat">Boneless Chicken</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all resize-none font-medium"
                                        value={editData.description}
                                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Image URL</label>
                                    <input
                                        type="text"
                                        className="add-inps w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500 transition-all font-medium"
                                        value={editData.image}
                                        onChange={(e) => setEditData({...editData, image: e.target.value})}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-amber-500 text-black font-black uppercase tracking-widest text-sm py-5 rounded-2xl hover:bg-amber-400 transition-all"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddItems;
