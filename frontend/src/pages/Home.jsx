import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Shield, Heart, ChefHat, Sparkles } from 'lucide-react';
import devs  from './Assets/devs.jpg'
import {  Truck } from "lucide-react";
import './Home.css';


const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-black text-white">

  {/* Glow Background */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400 opacity-20 blur-3xl rounded-full animate-pulse"></div>
  </div>

  <div className="home-main relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">

    <div className="egg-main flex flex-col lg:flex-row items-center gap-14">

      {/* LEFT CONTENT */}

      <div className="lg:w-1/2 space-y-8 animate-fade-in">

        {/* Tag */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-400"/>
          <span className="text-sm font-medium text-gray-200">
            Premium Poultry Marketplace
          </span>
        </div>

        {/* Heading */}
        <h1 className="main-text text-5xl md:text-7xl font-bold leading-tight">

          Fresh
          <span className="main-text block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Chicken & Eggs
          </span>

          <span className="block text-3xl md:text-5xl mt-3 text-gray-200">
            Direct From Farms
          </span>

        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
          Buy premium quality chicken, wings and farm eggs directly from
          trusted poultry sellers.
        </p>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-4">

          <Link
            to="/browse"
            className="group bg-gradient-to-r from-amber-400 to-amber-600 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition flex items-center justify-center gap-2 shadow-xl"
          >
            Explore Chicken
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
          </Link>

          

        </div>

        {/* Stats */}

        <div className="flex gap-10 pt-6">

          <div>
            <div className="text-3xl font-bold text-amber-400">120+</div>
            <div className="text-gray-400 text-sm">Poultry Farms</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-amber-400">15k+</div>
            <div className="text-gray-400 text-sm">Orders Delivered</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-amber-400">4.9★</div>
            <div className="text-gray-400 text-sm">Customer Rating</div>
          </div>

        </div>

      </div>

      {/* RIGHT IMAGE */}

      <div className="lg:w-1/2 relative">

        <div className="relative z-10">

          <img
            src="https://images.unsplash.com/photo-1559738928-5d5dc5c2458d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGVnZ3N8ZW58MHx8MHx8fDA%3D"
            alt="Fresh Chicken"
            className="rounded-3xl shadow-2xl border border-white/10 hover:scale-105 transition duration-500"
          />

          {/* Floating Fresh Badge */}

          <div className="absolute -bottom-6 -left-6 bg-zinc-900 border border-amber-400/30 p-4 rounded-2xl shadow-xl">

            <div className="flex items-center gap-3">

              <div className="bg-amber-400 text-black p-3 rounded-xl">
                <Heart className="w-6 h-6"/>
              </div>

              <div>
                <div className="font-bold text-white">Farm Fresh</div>
                <div className="text-sm text-gray-400">100% Quality Chicken</div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>









            {/* Features Section */}
            <div className="py-20 bg-black text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        Why Choose
        <span className="text-amber-400 ml-2">FlockPilot</span>?
      </h2>

      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Buy fresh chicken and poultry products directly from verified farms.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {[
        {
          icon: <Shield size={28} />,
          title: "Hygienic Processing",
          description: "Chicken processed with strict hygiene standards."
        },
        {
          icon: <Clock size={28} />,
          title: "Fresh Daily",
          description: "Fresh chicken prepared daily from trusted farms."
        },
        {
          icon: <Heart size={28} />,
          title: "Farm Direct",
          description: "Direct poultry farm supply with better quality."
        },
        {
          icon: <Truck size={28} />,
          title: "Fast Delivery",
          description: "Quick delivery to your doorstep."
        }
      ].map((feature, index) => (

        <div
          key={index}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-amber-400 transition"
        >

          <div className="text-amber-400 mb-4">
            {feature.icon}
          </div>

          <h3 className="text-xl font-bold mb-2">
            {feature.title}
          </h3>

          <p className="text-gray-400">
            {feature.description}
          </p>

        </div>

      ))}

    </div>

  </div>
</div>








           {/* Chicken Categories Section */}
<div className="py-20 bg-black">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl text-amber-500 font-bold mb-4">Our Chicken Categories</h2>
      <p className="text-white text-lg">Fresh parts and whole poultry for every need</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          title: "Fresh Raw Chicken",
          description: "Whole, farm-fresh chicken perfect for cooking any meal.",
          icon: "🍗",
          bgGradient: "from-amber-600 to-yellow-500"
        },
        {
          title: "Chicken Wings",
          description: "Tender and juicy wings ready to grill or fry.",
          icon: "🔥",
          bgGradient: "from-red-500 to-amber-500"
        },
        {
          title: "Fresh Eggs",
          description: "Organic and healthy eggs from free-range chickens.",
          icon: "🥚",
          bgGradient: "from-yellow-400 to-amber-500"
        },
        {
          title: "Chest Pieces",
          description: "Premium chicken breast cuts, lean and protein-rich.",
          icon: "🥩",
          bgGradient: "from-amber-500 to-amber-600"
        }
      ].map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl p-8 text-white bg-gradient-to-br ${card.bgGradient} shadow-lg hover:scale-105 transition-all duration-300`}
        >
          <div className="text-5xl mb-4">{card.icon}</div>
          <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
          <p className="text-white/90">{card.description}</p>
        </div>
      ))}
    </div>
  </div>
</div>

          



            {/* <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-600 text-lg">Get fresh chicken in 3 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-royal-blue via-royal-blue-600 to-royal-blue-700 -translate-y-1/2 z-0"></div>

                        {[
                            { step: '1', title: 'Browse Products', desc: 'Explore our selection of fresh chicken', icon: '🔍' },
                            { step: '2', title: 'Place Order', desc: 'Select your poultry parts and quantity', icon: '🛒' },
                            { step: '3', title: 'Enjoy Fresh Poultry', desc: 'Receive fresh delivery at your doorstep', icon: '🍗' }
                        ].map((item, index) => (
                            <div key={index} className="relative z-10 text-center">
                                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="bg-gradient-to-br from-royal-blue-500 to-royal-blue-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg">
                                        {item.step}
                                    </div>
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div> */}         

          

            {/* CTA Section */}
            <div className="relative overflow-hidden bg-black py-20 text-white ">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Taste the Difference?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of happy customers enjoying fresh poultry delivery every day
                    </p>
                    <Link to="/browse" className="order-btn inline-flex items-center gap-3 bg-white text-royal-blue px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-glow-lg hover:scale-105">
                        Start Ordering Now
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>





           


            
        </div>
    );
};

export default Home;
