import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import { Plus, Edit, Trash, ShoppingBag, Clock } from 'lucide-react';
import FoodAvailabilityToggle from '../components/admin/FoodAvailabilityToggle';
import OrderStatusBadge from '../components/admin/OrderStatusBadge';

const ChefDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [foods, setFoods] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState('menu');

    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        dietType: 'Regular',
        image: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState(null);

    useEffect(() => {
        fetchMyMenu();
        fetchMyOrders();
    }, []);

    const fetchMyMenu = async () => {
        try {
            const { data } = await axios.get('/api/food');
            const myFoods = data.foods.filter(
                f => f.chef && (f.chef.user === user._id || f.chef.user._id === user._id)
            );
            setFoods(myFoods);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/chef/orders');
            setOrders(data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const foodData = { ...newItem, images: [newItem.image] };

            if (isEditing) {
                await axios.put(`/api/food/${editItemId}`, foodData);
                alert('Product updated successfully!');
            } else {
                await axios.post('/api/food/add', foodData);
                alert('Product added successfully!');
            }

            setShowAddForm(false);
            resetForm();
            fetchMyMenu();
        } catch (error) {
            alert(error.response?.data?.message || 'Error processing request');
        }
    };

    const resetForm = () => {
        setNewItem({
            name: '',
            description: '',
            price: '',
            dietType: 'Regular',
            image: ''
        });

        setIsEditing(false);
        setEditItemId(null);
    };

    const handleEditClick = (food) => {
        setNewItem({
            name: food.name,
            description: food.description,
            price: food.price,
            dietType: food.dietType,
            image: food.images[0] || ''
        });

        setIsEditing(true);
        setEditItemId(food._id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                await axios.delete(`/api/food/${id}`);
                alert('Product deleted successfully');
                fetchMyMenu();
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/order/${orderId}/status`, { status: newStatus });

            setOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? { ...o, status: newStatus } : o
                )
            );
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-amber-500">
                            Chef Dashboard
                        </h1>
                        <p className="text-gray-400">
                            Manage your menu and orders
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                activeTab === 'menu'
                                    ? 'bg-amber-600 text-black'
                                    : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            My Menu
                        </button>

                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                activeTab === 'orders'
                                    ? 'bg-amber-600 text-black'
                                    : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            Orders
                        </button>

                        {activeTab === 'menu' && (
                            <button
                                onClick={() => {
                                    setShowAddForm(!showAddForm);
                                    resetForm();
                                }}
                                className="flex items-center bg-amber-600 text-black px-4 py-2 rounded-lg hover:bg-amber-500"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                {showAddForm ? 'Cancel' : 'Add Product'}
                            </button>
                        )}
                    </div>
                </div>

                {/* ADD PRODUCT FORM */}
                {activeTab === 'menu' && showAddForm && (
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 mb-8">
                        <h2 className="text-xl font-bold mb-6">
                            {isEditing ? 'Update Product' : 'Add New Product'}
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <input
                                type="text"
                                placeholder="Product Name"
                                required
                                className="bg-gray-800 p-3 rounded-xl"
                                value={newItem.name}
                                onChange={e =>
                                    setNewItem({
                                        ...newItem,
                                        name: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Price (PKR)"
                                required
                                className="bg-gray-800 p-3 rounded-xl"
                                value={newItem.price}
                                onChange={e =>
                                    setNewItem({
                                        ...newItem,
                                        price: e.target.value
                                    })
                                }
                            />

                            <select
                                className="bg-gray-800 p-3 rounded-xl"
                                value={newItem.dietType}
                                onChange={e =>
                                    setNewItem({
                                        ...newItem,
                                        dietType: e.target.value
                                    })
                                }
                            >
                                <option value="Regular">Fresh</option>
                                <option value="Frozen">Frozen</option>
                                <option value="Chilled">Chilled</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Image URL"
                                className="bg-gray-800 p-3 rounded-xl"
                                value={newItem.image}
                                onChange={e =>
                                    setNewItem({
                                        ...newItem,
                                        image: e.target.value
                                    })
                                }
                            />

                            <textarea
                                placeholder="Description"
                                rows="3"
                                className="md:col-span-2 bg-gray-800 p-3 rounded-xl"
                                value={newItem.description}
                                onChange={e =>
                                    setNewItem({
                                        ...newItem,
                                        description: e.target.value
                                    })
                                }
                            />

                            <button
                                type="submit"
                                className="md:col-span-2 bg-amber-600 text-black py-3 rounded-xl font-bold hover:bg-amber-500"
                            >
                                {isEditing ? 'Save Changes' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                )}

                {/* MENU LIST */}
                {activeTab === 'menu' && (
                    <>
                        {foods.length === 0 ? (
                            <div className="text-center py-20">
                                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                                <p className="text-gray-400">No products yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {foods.map(food => (
                                    <div
                                        key={food._id}
                                        className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden"
                                    >
                                        <img
                                            src={
                                                food.images[0] ||
                                                'https://via.placeholder.com/400'
                                            }
                                            alt={food.name}
                                            className="w-full h-48 object-cover"
                                        />

                                        <div className="p-5">
                                            <div className="flex justify-between mb-2">
                                                <h3 className="font-bold text-lg">
                                                    {food.name}
                                                </h3>

                                                <p className="text-amber-400 font-bold">
                                                    Rs {food.price}
                                                </p>
                                            </div>

                                            <p className="text-gray-400 text-sm mb-4">
                                                {food.description}
                                            </p>

                                            <div className="flex justify-between items-center">

                                                <FoodAvailabilityToggle
                                                    foodId={food._id}
                                                    initialStatus={food.available}
                                                    onUpdate={(updatedFood) => {
                                                        setFoods(prev =>
                                                            prev.map(f =>
                                                                f._id === updatedFood._id
                                                                    ? updatedFood
                                                                    : f
                                                            )
                                                        );
                                                    }}
                                                />

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(food)}
                                                        className="p-2 hover:text-amber-500"
                                                    >
                                                        <Edit size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(food._id)
                                                        }
                                                        className="p-2 hover:text-red-500"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ORDERS */}
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-20">
                                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                                <p className="text-gray-400">No orders yet</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div
                                    key={order._id}
                                    className="bg-gray-900 border border-gray-700 rounded-xl p-6"
                                >
                                    <div className="flex justify-between mb-4">
                                        <h3 className="font-bold">
                                            Order #{order._id.slice(-6)}
                                        </h3>

                                        <OrderStatusBadge status={order.status} />
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {order.items.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex justify-between text-sm"
                                            >
                                                <span>
                                                    {item.quantity}x {item.name}
                                                </span>

                                                <span>
                                                    Rs {item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">

                                        <button
                                            onClick={() =>
                                                updateOrderStatus(order._id, 'Pending')
                                            }
                                            className="px-3 py-1 bg-yellow-600 rounded"
                                        >
                                            Pending
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateOrderStatus(order._id, 'Delivered')
                                            }
                                            className="px-3 py-1 bg-green-600 rounded"
                                        >
                                            Delivered
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateOrderStatus(order._id, 'Cancelled')
                                            }
                                            className="px-3 py-1 bg-red-600 rounded"
                                        >
                                            Cancelled
                                        </button>

                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChefDashboard;