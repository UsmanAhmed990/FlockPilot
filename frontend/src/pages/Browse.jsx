
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { Search, Star, ShoppingCart, Sparkles } from 'lucide-react';
import OrderHistory from './OrderHistory';

const Browse = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const { data } = await axios.get('/api/food');
                setFoods(data.foods || []);
            } catch (error) {
                console.error(error);
                setFoods([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, []);

/* SEARCH */
const filteredFoods = foods.filter(food =>
food.name.toLowerCase().includes(keyword.toLowerCase())
);

const handleAddToCart = (food) => {

setSelectedFood(food);
setShowConfirmModal(true);

};

const confirmAddToCart = () => {

if(selectedFood){

dispatch(addToCart({
    food: selectedFood._id,
    name: selectedFood.name,
    price: selectedFood.price,
    image: selectedFood.images && selectedFood.images.length > 0 ? selectedFood.images[0] : '',
    quantity: 1,
    seller: selectedFood.seller?._id
}));

}

setShowConfirmModal(false);
setSelectedFood(null);

};

const cancelAddToCart = () => {

setShowConfirmModal(false);
setSelectedFood(null);

};

return (

<div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">

  {/* HEADER */}
  <div className="relative overflow-hidden py-14 sm:py-16 md:py-20 text-center px-4">
    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent blur-3xl"></div>

    <Sparkles className="mx-auto text-amber-400 animate-pulse mb-3" />

    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
      Browse Poultry Market
    </h1>

    <p className="text-zinc-300 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
      Our chicken category features a wide range of options including whole chicken, boneless breasts, drumsticks and wings
    </p>
  </div>
<br />
  {/* SEARCH */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="relative mb-10 sm:mb-12">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" />

      <input
        type="text"
        placeholder="Search poultry products..."
        value={keyword}
        onChange={(e)=>setKeyword(e.target.value)}
        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-zinc-900 border border-zinc-700 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm sm:text-base"
      />
    </div>

    {/* GRID */}
    {loading ? (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-amber-400 font-black uppercase tracking-widest text-sm">
          Scanning Marketplace...
        </p>
      </div>
    ) : filteredFoods.length === 0 ? (
      <div className="text-center py-20 sm:py-28 bg-zinc-900/40 rounded-3xl border-2 border-dashed border-zinc-800">
        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={36} className="text-zinc-700" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 italic">
          MARKETPLACE IS CURRENTLY EMPTY
        </h3>

        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto">
          No listings found. {keyword ? `No products matching "${keyword}"` : "New fresh arrivals are expected shortly from our verified sellers."}
        </p>
      </div>
    ) : (
      <div className="grid gap-6 sm:gap-8 md:gap-10 
                      grid-cols-1 
                      sm:grid-cols-2 
                      md:grid-cols-2 
                      lg:grid-cols-3 
                      xl:grid-cols-4">

        {filteredFoods.map(food => (
          <div
            key={food._id}
            className="group w-full bg-zinc-900/70 backdrop-blur-lg border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col"
          >

            {/* IMAGE */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <img
                src={food.images && food.images[0] ? food.images[0] : 'https://images.unsplash.com/photo-1587593810167-a84920ea0781'}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-amber-400 uppercase">
                {food.category || 'Poultry'}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">

              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold italic">4.9 TOP RATED</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white mb-2 uppercase group-hover:text-amber-400 transition">
                  {food.name}
                </h3>

                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                  {food.description}
                </p>
              </div>

              {/* ✅ PRICE + BUTTON ALWAYS VISIBLE */}
              <div className="flex items-center justify-between mt-2">
                
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">Price</span>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    Rs {food.price}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(food)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 px-3 sm:px-4 py-2 rounded-xl text-black text-xs font-bold hover:opacity-90 transition"
                >
                  <ShoppingCart size={14} />
                  Add
                </button>

              </div>
            </div>

          </div>
        ))}
      </div>
    )}

    <OrderHistory />

  </div>

  {/* MODAL */}
  {showConfirmModal && (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl">

        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="text-amber-400" size={32} />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Confirm Purchase
        </h2>

        <p className="text-zinc-400 mb-6 text-sm sm:text-base">
          Add <span className="text-amber-400 font-bold">{selectedFood?.name}</span> to your order?
        </p>

        <div className="flex gap-3">
          <button
            onClick={cancelAddToCart}
            className="flex-1 py-2.5 sm:py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition text-sm"
          >
            Cancel
          </button>

          <button
            onClick={confirmAddToCart}
            className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:opacity-90 transition text-sm"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  )}

</div>

);

};

export default Browse;
