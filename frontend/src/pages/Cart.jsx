import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../features/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft, Plus, Minus, ShoppingCart, Star, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import socket from "../utils/socket";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [recentReviews, setRecentReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (cartItems.length === 0) {
      fetchRecentReviews();
    }
  }, [cartItems.length]);

  const fetchRecentReviews = async () => {
    try {
      const { data } = await axios.get('/api/review/seller/recent');
      setRecentReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim() && selectedRating === 0) {
        alert("Please select a rating or enter a review.");
        return;
    }
    
    setIsSubmitting(true);
    try {
        await axios.post('/api/reviews/ratings', {
            comment: feedback || `Rated ${selectedRating} stars`,
            rating: selectedRating || undefined,
            name: user?.name,
            email: user?.email
        });
        setRatingSubmitted(true);
        setTimeout(() => setRatingSubmitted(false), 3000);
        setFeedback("");
        setSelectedRating(0);
        setHoveredRating(0);
    } catch (error) {
        console.error("Feedback Error:", error);
        alert("Failed to submit review. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const deliveryFee = subtotal > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (food, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ food, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=checkout");
      return;
    }
    navigate("/checkout");
  };

  /* EMPTY CART */

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <div className="w-28 h-28 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <ShoppingCart size={46} />
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Your Poultry Cart is Empty
          </h2>

          <p className="text-gray-400 mb-8">
            Browse fresh chicken, wings and eggs from trusted sellers.
          </p>

          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            <ArrowLeft size={18} />
            Browse Marketplace
          </Link>

        

          {/* NEW FEEDBACK SUBMISSION SECTION */}
          <div className="mt-20 max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold mb-2">Rate & Review</h3>
            <p className="text-gray-400 mb-6 italic text-sm">
              Tap the stars to rate your experience, then add your thoughts!
            </p>

            {/* SUCCESS TOAST */}
            {ratingSubmitted && (
              <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3 animate-bounce">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-green-400 font-bold text-sm">Rating Submitted!</p>
                  <p className="text-green-300/70 text-xs">Your feedback is now live on the admin dashboard.</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">

              {/* ⭐ INTERACTIVE STAR SELECTOR */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Your Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className={`text-4xl transition-all duration-200 transform hover:scale-125 ${
                        star <= (hoveredRating || selectedRating)
                          ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                          : 'text-zinc-700 hover:text-zinc-500'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {selectedRating > 0 && (
                  <p className="text-amber-400 text-sm font-bold animate-pulse">
                    {selectedRating === 1 && '😞 Poor'}
                    {selectedRating === 2 && '😐 Fair'}
                    {selectedRating === 3 && '🙂 Good'}
                    {selectedRating === 4 && '😊 Very Good'}
                    {selectedRating === 5 && '🤩 Excellent!'}
                  </p>
                )}
              </div>

              {/* 📝 COMMENT */}
              <div className="relative group">
                <textarea
                  placeholder="Share your experience (optional)..."
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white rounded-2xl p-5 outline-none focus:border-amber-400 transition-all placeholder:text-zinc-600 resize-none"
                ></textarea>
                <div className="absolute inset-0 rounded-2xl border border-amber-400/0 group-focus-within:border-amber-400/20 pointer-events-none transition-all"></div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || (selectedRating === 0 && !feedback.trim())}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(251,191,36,0.1)] flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : <Star size={18} />}
                {isSubmitting ? "Submitting..." : selectedRating > 0 ? `Submit ${selectedRating}-Star Review` : "Submit Review"}
              </button>
            </form>
          </div>
<br />
        </div>
      </div>
    );
  }
   

  return (
    <div className="min-h-screen bg-black text-white py-10">

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}

        <div className="mb-10">

          <Link
            to="/browse"
            className="flex items-center gap-2 text-amber-400 hover:gap-3 transition mb-4"
          >
            <ArrowLeft size={18} />
            Continue Browsing
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Poultry Cart
          </h1>

          <p className="text-gray-400 mt-2">
            {cartItems.length} product{cartItems.length !== 1 ? "s" : ""} in your cart
          </p>

        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* CART ITEMS */}

          <div className="lg:w-2/3 space-y-5">

            {cartItems.map((item, index) => (

              <div
                key={item.food}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-amber-400/40 transition-all hover:shadow-xl"
              >

                <div className="flex flex-col sm:flex-row gap-5">

                  {/* IMAGE */}

                  <div className="w-full sm:w-36 h-32">

                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500";
                      }}
                    />

                  </div>

                  {/* DETAILS */}

                  <div className="flex-1">

                    <h3 className="text-xl font-bold mb-2">
                      {item.name}
                    </h3>

                    <p className="text-amber-400 font-semibold text-lg mb-4">
                      Rs. {item.price}
                    </p>

                    {/* QUANTITY */}

                    <div className="flex items-center gap-4 flex-wrap">

                      <div className="flex items-center bg-black border border-zinc-700 rounded-lg">

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.food,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-2 hover:bg-amber-500 hover:text-black transition rounded-l-lg"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.food,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-2 hover:bg-amber-500 hover:text-black transition rounded-r-lg"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      <p className="text-gray-400">
                        Subtotal:
                        <span className="text-white font-semibold ml-2">
                          Rs. {item.quantity * item.price}
                        </span>
                      </p>

                    </div>

                  </div>

                  {/* REMOVE */}

                  <button
                    onClick={() => dispatch(removeFromCart(item.food))}
                    className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg self-start"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            ))}

            {/* CLEAR CART */}

            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear your poultry cart?"
                  )
                ) {
                  dispatch(clearCart());
                }
              }}
              className="text-red-400 hover:text-red-500 flex items-center gap-2 mt-4"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>

          </div>

          {/* ORDER SUMMARY */}

          <div className="lg:w-1/3">

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">

              <h2 className="text-2xl font-bold mb-6">
                Order Details
              </h2>

              <div className="space-y-4 mb-6">

                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">
                    Rs. {subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-white font-semibold">
                    Rs. {deliveryFee}
                  </span>
                </div>

                <div className="border-t border-zinc-700 pt-4 flex justify-between text-xl font-bold">

                  <span>Total</span>

                  <span className="text-amber-400">
                    Rs. {total}
                  </span>

                </div>

              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold py-3 rounded-xl hover:scale-105 transition"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-300">
                ✓ Excellent delivery services provided
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;