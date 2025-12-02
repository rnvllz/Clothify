import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Header: React.FC = () => {
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  
  return (
  <header className="bg-white shadow-sm border-b border-gray-100">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-light text-black tracking-wider">
          CLOTHIFY
        </Link>
        <nav className="flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-gray-800 hover:text-black transition-colors font-light text-sm uppercase tracking-wide"
          >
            Shop
          </Link>
          <Link 
            to="/cart" 
            className="text-gray-800 hover:text-black transition-colors font-light text-sm uppercase tracking-wide relative"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-normal rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </div>
  </header>
  );
};

export default Header;
