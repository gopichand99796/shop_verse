import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cart } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Truck, Shield } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../lib/utils';
import { getProductImage, fallbackProductImage } from '../lib/productImages';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export default function CartPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['cart'], queryFn: () => cart.get() });
  const removeMutation = useMutation({ 
    mutationFn: (id: string) => cart.remove(id), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) 
  });

  const items = (data as any)?.data?.items || [];
  const err = (data as any)?.error || (data as any)?.message || null;

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
    }));
  };

  const subtotal = items.reduce((sum: number, item: any) => {
    const qty = quantities[item._id] || item.qty || 1;
    return sum + (item.product.price * qty);
  }, 0);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'welcome10') {
      setAppliedCoupon(couponCode);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (err) return <div className="text-red-600 text-center py-16">{err}</div>;

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-8">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet."
            action={{
              label: "Start Shopping",
              onClick: () => window.location.href = '/products'
            }}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: any, index: number) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackProductImage;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product._id}`} className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-neutral-500 mt-1">{item.product.brand}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center border border-neutral-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              disabled={(quantities[item._id] || item.qty || 1) <= 1}
                              className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-2 font-medium min-w-[40px] text-center">
                              {quantities[item._id] || item.qty || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="p-2 hover:bg-neutral-100 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeMutation.mutate(item._id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={removeMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          {formatPrice(item.product.price * (quantities[item._id] || item.qty || 1))}
                        </p>
                        <p className="text-sm text-neutral-500">{formatPrice(item.product.price)} each</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-neutral-200 pt-4 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || appliedCoupon === couponCode}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600 mt-2">Coupon applied successfully!</p>
                  )}
                </div>

                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
