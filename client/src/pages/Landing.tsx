import { useQuery } from '@tanstack/react-query';
import { products, categories, banners } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../lib/utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

export default function Landing() {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => products.list({ page: 1, limit: 8, isFeatured: true })
  });
  
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categories.list()
  });
  
  const { data: bannersData, isLoading: bannersLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => banners.list()
  });

  // Log API response to debug shape
  console.log('Landing - Products API Response:', productsData);
  console.log('Landing - Categories API Response:', categoriesData);
  console.log('Landing - Banners API Response:', bannersData);

  // Handle different response shapes: raw array, { data: [...] }, { success: true, data: [...] }, { data: { items: [...] } }
  const featuredProducts = Array.isArray(productsData) 
    ? productsData 
    : Array.isArray((productsData as any)?.data)
      ? (productsData as any).data
      : Array.isArray((productsData as any)?.data?.items)
        ? (productsData as any).data.items
        : Array.isArray((productsData as any)?.items)
          ? (productsData as any).items
          : [];
  const categoriesList = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray((categoriesData as any)?.data)
      ? (categoriesData as any).data
      : (categoriesData as any)?.data || [];
  const bannersList = Array.isArray(bannersData)
    ? bannersData
    : Array.isArray((bannersData as any)?.data)
      ? (bannersData as any).data
      : (bannersData as any)?.data || [];

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % bannersList.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + bannersList.length) % bannersList.length);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi0yIDJjMCAyIDIgNCAyIDRzMiAyIDIgMi0yIDItMiAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Discover Premium Products for Your Lifestyle
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Shop the latest trends in electronics, fashion, home essentials, and more. Quality guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent"></div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Free Shipping</h3>
                <p className="text-sm text-neutral-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Secure Payment</h3>
                <p className="text-sm text-neutral-500">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">24/7 Support</h3>
                <p className="text-sm text-neutral-500">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categoriesList.slice(0, 5).map((category: any, index: number) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/products?category=${category._id}`}>
                    <Card className="group h-full hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="p-6 flex flex-col items-center text-center h-full">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">{category.name.charAt(0)}</span>
                        </div>
                        <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
                Featured Products
              </h2>
              <p className="text-lg text-neutral-600">Handpicked products just for you</p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any, index: number) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/products/${product._id}`}>
                    <Card className="group h-full hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="relative">
                        <div className="aspect-square bg-neutral-100 overflow-hidden flex items-center justify-center text-neutral-500">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-sm">No Image</div>
                          )}
                        </div>
                        {product.discountPrice && product.discountPrice < product.price && (
                          <div className="absolute top-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Sale
                          </div>
                        )}
                        {product.isFeatured && (
                          <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-neutral-600">{product.ratings?.avg || 0}</span>
                          <span className="text-sm text-neutral-400">({product.ratings?.count || 0})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-neutral-900">
                            {formatPrice(product.discountPrice || product.price)}
                          </span>
                          {product.discountPrice && product.discountPrice < product.price && (
                            <span className="text-sm text-neutral-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Summer Sale - Up to 50% Off
              </h2>
              <p className="text-lg text-neutral-300 mb-8">
                Don't miss out on our biggest sale of the season. Limited time offer on selected items.
              </p>
              <Link to="/products?tag=summer">
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Shop Sale Items
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl md:text-8xl font-display font-bold mb-2">50%</div>
                  <div className="text-xl md:text-2xl">OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-lg text-neutral-600">Check out the latest additions to our store</p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product: any, index: number) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/products/${product._id}`}>
                    <Card className="group h-full hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="relative">
                        <div className="aspect-square bg-neutral-100 overflow-hidden flex items-center justify-center text-neutral-500">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-sm">No Image</div>
                          )}
                        </div>
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          New
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-neutral-900">
                            {formatPrice(product.discountPrice || product.price)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
