import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutAdmin } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  return (
    <header className="bg-zinc-950 border-b border-zinc-900 sticky top-0 z-50">
      <div className="container mx-auto px-3 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 hover:opacity-80 transition-opacity">
            Մեծածախ վաճառք
          </Link>
          
          <nav className="flex items-center gap-4 md:gap-6">
            <Link 
              to="/products/Սպորտային կոշիկներ" 
              className="text-xs md:text-sm text-zinc-300 hover:text-blue-400 transition-colors font-medium"
            >
              Ապրանքներ
            </Link>
            
            <Link 
              to="/cart" 
              className="relative text-zinc-300 hover:text-orange-400 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <Link 
                to="/admin/login" 
                className="flex items-center gap-1 text-xs md:text-sm text-zinc-300 hover:text-blue-400 transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Ադմին</span>
              </Link>
            ) : (
              <>
                <Link 
                  to="/admin" 
                  className="text-xs md:text-sm text-zinc-300 hover:text-blue-400 transition-colors font-medium"
                >
                  Վահանակ
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs md:text-sm text-zinc-300 hover:text-orange-400 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Ելք</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;