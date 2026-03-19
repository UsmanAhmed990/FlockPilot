import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../features/cartSlice";
import { MapPin, Phone, User, Home } from "lucide-react";
import axios from "../utils/axios";

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  const [address, setAddress] = useState({
    street: "",
    city: "",
    username: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentFile, setPaymentFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const openJazzCash = () => {
    window.location.href =
      "intent://#Intent;scheme=jazzcash;package=com.techlogix.mobilinkcustomer;end";
  };

  const openEasyPaisa = () => {
    window.location.href =
      "intent://#Intent;scheme=easypaisa;package=com.telenor.easypaisa;end";
  };

  const openBank = () => {
    alert(
      "Please transfer payment to Meezan Bank Account: 1234567890"
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === "Online" && !paymentFile) {
        alert("Please upload payment screenshot");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append(
        "items",
        JSON.stringify(
          cartItems.map((item) => ({
            food: item.food,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          }))
        )
      );

      formData.append("totalAmount", total);
      formData.append("paymentMethod", paymentMethod);

      formData.append(
        "deliveryAddress",
        JSON.stringify({
          street: address.street,
          city: address.city,
        })
      );

      formData.append("customerName", address.username);
      formData.append("customerEmail", address.email);
      formData.append("customerPhone", address.phone);

      if (paymentFile) {
        formData.append("paymentScreenshot", paymentFile);
      }

      await axios.post("/api/order/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(clearCart());
      alert("✅ Order placed successfully,plaese check your email for order details");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("❌ Order failed! plaese try again");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-10">

      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          Poultry Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >

          {/* ADDRESS SECTION */}

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

              <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
                <MapPin className="text-amber-400" />
                Delivery Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={address.username}
                  onChange={(e) =>
                    setAddress({ ...address, username: e.target.value })
                  }
                  className="bg-black border border-zinc-700 rounded-lg p-3 focus:border-amber-400 outline-none"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="bg-black border border-zinc-700 rounded-lg p-3 focus:border-amber-400 outline-none"
                />

                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={address.email}
                  onChange={(e) =>
                    setAddress({ ...address, email: e.target.value })
                  }
                  className="bg-black border border-zinc-700 rounded-lg p-3 md:col-span-2 focus:border-amber-400 outline-none"
                />

                <textarea
                  rows="2"
                  required
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  className="bg-black border border-zinc-700 rounded-lg p-3 md:col-span-2 focus:border-amber-400 outline-none"
                />

                <input
                  type="text"
                  required
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="bg-black border border-zinc-700 rounded-lg p-3 focus:border-amber-400 outline-none"
                />

  <input
                  type="text"
                  required
                  placeholder="Postal Code"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="bg-black border border-zinc-700 rounded-lg p-3 focus:border-amber-400 outline-none"
                />


              </div>
            </div>

            {/* PAYMENT */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-amber-400/40 transition">

  <div className="flex items-start gap-4">

    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-bold">
      💵
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-1">
        Cash on Delivery
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed">
        Receive your poultry order first, inspect the chicken pieces or eggs,
        and pay in cash only after confirming everything is fresh and correct.
      </p>
    </div>

  </div>

</div>
             

             

            </div>

          </div>

          {/* ORDER SUMMARY */}

          <div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">

              <h3 className="text-2xl font-bold mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">

                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>

                <div className="border-t border-zinc-700 pt-4 flex justify-between text-xl font-bold">

                  <span>Total</span>

                  <span className="text-amber-400">
                    Rs. {total}
                  </span>

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold py-3 rounded-xl hover:scale-105 transition"
              >
                {loading ? "Placing Order..." : `Place Order - Rs ${total}`}
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Checkout;