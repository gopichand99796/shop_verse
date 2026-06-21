import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { products, cart } from '../services/api';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Clock, ChevronLeft, Check, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../lib/utils';
import { getProductImage, fallbackProductImage } from '../lib/productImages';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => products.get(id || ''),
    enabled: !!id
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => cart.add(productId, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  // Log API response to debug shape
  console.log('ProductDetail - API Response:', data);

  // Handle different response shapes: raw object, { data: {...} }, { success: true, data: {...} }
  const responseData = data as any;
  const product = responseData && typeof responseData === 'object' && !Array.isArray(responseData)
    ? responseData.data || responseData
    : null;
  const err = responseData && typeof responseData === 'object' && responseData.success === false
    ? responseData.message || responseData.error || 'Unable to load product'
    : null;

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCartMutation.mutate(product._id);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product?.stock || 1, prev + delta)));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (err) return <div className="text-red-600 text-center py-16">{err}</div>;
  if (!product) return <div className="text-center py-16">Product not found</div>;

  const specs = product.specs || {};
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-neutral-100">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackProductImage;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary-500' : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={image || fallbackProductImage}
                      alt={`${product.name} ${index + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackProductImage;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-sm text-primary-600 font-medium mb-2">{product.brand}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.ratings?.avg || 0}</span>
                  <span className="text-neutral-400">({product.ratings?.count || 0} reviews)</span>
                </div>
                {product.stock > 0 && product.stock < 10 && (
                  <Badge variant="warning">Only {product.stock} left in stock</Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="danger">Out of Stock</Badge>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-neutral-900">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && product.discountPrice < product.price && (
                <>
                  <span className="text-xl text-neutral-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="success">Save {discountPercentage}%</Badge>
                </>
              )}
            </div>

            <p className="text-lg text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Product Specs */}
            {Object.keys(specs).length > 0 && (
              <Card variant="outlined" className="p-6">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-neutral-600 capitalize">{key}</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-300 rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-neutral-500">
                  {product.stock} available
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addToCartMutation.isPending}
                  isLoading={addToCartMutation.isPending}
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? 'text-accent-600 border-accent-600' : ''}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-primary-600" />
                </div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-neutral-500">On orders over $50</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-neutral-500">100% protected</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <p className="text-sm font-medium">Fast Delivery</p>
                <p className="text-xs text-neutral-500">2-3 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
