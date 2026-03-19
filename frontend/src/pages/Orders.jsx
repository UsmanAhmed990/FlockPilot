import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import { Package, Clock, CheckCircle, XCircle, Truck, Star } from 'lucide-react';
const Orders = () => {
    const { user } = useSelector(state => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewingOrderId, setReviewingOrderId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/me');
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (orderId, chefId) => {
        if (!rating) {
            alert('Please select a rating');
            return;
        }
        setIsSubmitting(true);
        try {
            await axios.post('/api/review/seller', {
                orderId,
                chefId,
                rating,
                comment
            });
            alert('Rating & Review submitted successfully! Thank you.');
            setReviewingOrderId(null);
            setRating(5);
            setComment('');
            fetchOrders(); // Refresh to hide review box
        } catch (error) {
            console.error('Review Error:', error);
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'Out for Delivery':
                return <Truck className="w-5 h-5 text-blue-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Preparing':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-royal-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 animate-scale-in">
                        <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
                        <p className="text-gray-600 mb-8">You haven't placed any orders yet</p>
                        <a href="/browse" className="btn-primary inline-block">
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <div 
                                key={order._id} 
                                className="card p-6 hover:shadow-xl transition-all animate-slide-up"
                                style={{animationDelay: `${index * 50}ms`}}
                            >
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-mono font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <p className="text-sm text-gray-600">Placed on</p>
                                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-PK', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}</p>
                                    </div>
                                    <div className={`mt-2 md:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span className="font-semibold">{order.status}</span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4 mb-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <img 
                                                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"} 
                                                alt={item.name} 
                                                className="w-20 h-20 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                                                }}
                                            />
                                            <div className="flex-grow">
                                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-bold text-royal-blue">Rs. {item.price} × {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-gray-600">Delivery Address</p>
                                        <p className="font-medium text-gray-900">
                                            {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.zip}
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-right">
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-2xl font-bold text-royal-blue">Rs. {order.totalAmount}</p>
                                        <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                                    </div>
                                </div>

                                {/* Review Section */}
                                {order.status === 'Delivered' && !order.isReviewed && (
                                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                                        {reviewingOrderId === order._id ? (
                                            <div className="bg-gray-50 p-6 rounded-2xl animate-fade-in border border-amber-100">
                                                <h4 className="font-bold text-gray-900 mb-4">Rate your Seller experience</h4>
                                                
                                                <div className="flex gap-2 mb-4">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setRating(star)}
                                                            className="focus:outline-none transition-transform active:scale-90"
                                                        >
                                                            <Star 
                                                                className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>

                                                <textarea
                                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none mb-4"
                                                    placeholder="Share your feedback about the seller and poultry quality..."
                                                    rows="3"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></textarea>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleReviewSubmit(order._id, order.chef)}
                                                        disabled={isSubmitting}
                                                        className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                    <button
                                                        onClick={() => setReviewingOrderId(null)}
                                                        className="px-6 py-2 text-gray-600 font-medium hover:text-gray-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">How was the poultry?</p>
                                                        <p className="text-sm text-gray-500">Rate this seller to help others.</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setReviewingOrderId(order._id)}
                                                    className="w-full md:w-auto px-8 py-2 border-2 border-amber-500 text-amber-600 font-bold rounded-xl hover:bg-amber-500 hover:text-black transition-colors"
                                                >
                                                    Rate Seller
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
