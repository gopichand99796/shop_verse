import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { Mail, Phone, MapPin, ArrowRight, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-neutral-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-2xl font-display font-bold">ShopVerse</span>
              </div>
              <p className="text-neutral-400 mb-6">
                Your premium destination for quality products. Shop the latest trends with confidence.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/products" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/deals" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Deals
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/deals" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Deals
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/cart" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/checkout" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Checkout
                  </Link>
                </li>
                <li>
                  <Link to="/addresses" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Shipping Addresses
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                  <span className="text-neutral-400">123 Commerce Street, New York, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span className="text-neutral-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span className="text-neutral-400">support@shopverse.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-16 pt-8 border-t border-neutral-800">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-neutral-400 mb-4">Get exclusive deals and updates delivered to your inbox.</p>
              <form className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500"
                />
                <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-400 text-sm">
            <p>© 2024 ShopVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
