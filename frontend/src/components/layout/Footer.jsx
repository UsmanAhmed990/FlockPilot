import { Egg, Drumstick, Mail, Phone } from "lucide-react";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-auto border-t border-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className=" all-cls grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              FlockPilot
            </h3>
            <p className="fotter-p text-gray-400 text-sm leading-relaxed">
              Fresh poultry marketplace where buyers connect with trusted
              sellers to purchase premium chicken, wings and farm eggs
              delivered with quality and hygiene.
            </p>

            <div className="flex space-x-3 pt-2">
              <Egg className="text-amber-400 animate-pulse" size={20} />
              <Drumstick className="text-amber-400 animate-pulse" size={20} />
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="h4 font-semibold mb-4 text-amber-400">
              Marketplace
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="li-p">
                <a href="/browse" className="hover:text-amber-400 transition">
                  Browse Chicken
                </a>
              </li>
              <li className="li-p">
                <a href="/eggs" className="hover:text-amber-400 transition">
                  Farm Eggs
                </a>
              </li>
              <li className="li-p">
                <a href="/wings" className="hover:text-amber-400 transition">
                  Chicken Wings
                </a>
              </li>
              <li className="li-p">
                <a href="/sellers" className="hover:text-amber-400 transition">
                  Trusted Sellers
                </a>
              </li>
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h4 className=" h4 font-semibold mb-4 text-amber-400">
              For Sellers
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="li-p">
                <a href="/signup" className="hover:text-amber-400 transition">
                  Join Marketplace
                </a>
              </li>
              <li className="li-p">
                <a href="/seller/dashboard" className="hover:text-amber-400 transition">
                  Seller Dashboard
                </a>
              </li>
              <li className="li-p">
                <a href="/seller/products" className="hover:text-amber-400 transition">
                  Manage Listings
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="h4 font-semibold mb-4 text-amber-400">
              Contact
            </h4>

            <div className="space-y-3 text-gray-400 text-sm">

              <div className="flex items-center gap-2 hover:text-amber-400 transition">
                <Mail size={16} />
                support@flockpilot.com
              </div>

              <div className="flex items-center gap-2 hover:text-amber-400 transition">
                <Phone size={16} />
                +92 300 1234567
              </div>

              <p className="text-gray-500 text-xs pt-2">
                Faisalabad, Pakistan
              </p>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className=" btt border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} 
            <span className="text-amber-400 font-medium"> FlockPilot </span>
            Poultry Marketplace. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;