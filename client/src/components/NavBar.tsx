import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart, LogOut } from 'lucide-react';
import useAuth from '../store/useAuth';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { cart as apiCart, wishlist as apiWishlist } from '../services/api';

export default function NavBar() {
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const logout = useAuth((s) => s.logout);
  console.log('Navbar render');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = useNavigate();

  const { data: cartData } = useQuery({ queryKey: ['cart'], queryFn: () => apiCart.get(), staleTime: 1000 * 60, enabled: isAuthenticated });
  const { data: wishlistData } = useQuery({ queryKey: ['wishlist'], queryFn: () => apiWishlist.list(), staleTime: 1000 * 60, enabled: isAuthenticated });

  const cartCount = isAuthenticated ? ((cartData as any)?.data?.items?.length || 0) : 0;
  const wishCount = isAuthenticated ? ((wishlistData as any)?.data?.length || 0) : 0;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ShopVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">
              Categories
            </Link>
            <Link to="/deals" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">
              Deals
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/search"
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-primary-600"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              to="/wishlist"
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-primary-600 relative"
            >
              <Heart className="h-5 w-5" />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-primary-600 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-neutral-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
                  <span className="text-neutral-700">{user?.name || 'Account'}</span>
                </Link>
                <button onClick={() => { logout(); nav('/'); }} className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white border border-primary-600 text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-neutral-200 bg-white"
        >
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/products"
              className="block px-4 py-2 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="block px-4 py-2 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/deals"
              className="block px-4 py-2 rounded-xl hover:bg-neutral-100 text-neutral-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
            </Link>
            <div className="border-t border-neutral-200 pt-3 mt-3 flex items-center gap-3">
              <Link
                to="/search"
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
              </Link>
              <Link
                to="/wishlist"
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
              </Link>
              <Link
                to="/cart"
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
              {user ? (
                <Link
                  to="/orders"
                  className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
