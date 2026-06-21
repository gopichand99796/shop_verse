import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../store/useAuth';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShoppingCart, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuth((s) => s.login);
  const nav = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      nav('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ShopVerse
            </span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Welcome Back</h1>
          <p className="text-neutral-600">Sign in to your account to continue</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handle} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              icon={<Mail className="h-5 w-5 text-neutral-400" />}
            />
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                icon={<Lock className="h-5 w-5 text-neutral-400" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-12 top-9 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Create account <ArrowRight className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
