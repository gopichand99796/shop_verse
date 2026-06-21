import { Link } from 'react-router-dom';
import useAuth from '../store/useAuth';

export default function NavBar() {
  const user = useAuth((s) => s.user);
  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold">ShopVerse</Link>
          <Link to="/products" className="text-sm text-slate-600">Products</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/search" className="text-sm">Search</Link>
          <Link to="/cart" className="text-sm">Cart</Link>
          {user ? <Link to="/account" className="text-sm">Account</Link> : <Link to="/login" className="text-sm">Login</Link>}
        </div>
      </div>
    </nav>
  );
}
