import { useQuery } from '@tanstack/react-query';
import { products } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { getProductImage, fallbackProductImage } from '../lib/productImages';

export default function Deals() {
  const featuredQuery = useQuery({ queryKey: ['featuredProducts'], queryFn: () => products.featured(), });
  const { data: featuredData, isLoading: featuredLoading } = featuredQuery;

  const allProductsQuery = useQuery({ queryKey: ['allProductsForDeals'], queryFn: () => products.list({ limit: 24 }), });
  const allProducts = Array.isArray(allProductsQuery.data)
    ? allProductsQuery.data
    : Array.isArray((allProductsQuery.data as any)?.data)
      ? (allProductsQuery.data as any).data
      : [];

  const topDeals = allProducts.filter((product: any) => product.discountPrice && product.discountPrice < product.price).slice(0, 8);
  const bestSellers = allProducts
    .filter((product: any) => product.ratings?.count)
    .sort((a: any, b: any) => (b.ratings?.count || 0) - (a.ratings?.count || 0))
    .slice(0, 8);

  const featuredProducts = Array.isArray(featuredData)
    ? featuredData
    : Array.isArray((featuredData as any)?.data)
      ? (featuredData as any).data
      : [];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">Deals</h1>
          <p className="text-neutral-600 mt-2">Featured items, discounts, and best-selling products all in one place.</p>
        </div>
        <Link to="/products" className="px-5 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
          Shop All Products
        </Link>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Featured Products</h2>
            <p className="text-neutral-500">Hand-picked products our customers love.</p>
          </div>
          <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700">View all</Link>
        </div>
        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="rounded-3xl bg-neutral-100 p-10 text-center">
            <p className="text-lg font-semibold text-neutral-900">No featured products available</p>
            <p className="text-neutral-600 mt-2">Check back soon for new deals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <motion.div key={product._id} whileHover={{ y: -4 }} className="group">
                <Link to={`/products/${product._id}`}>
                  <Card className="overflow-hidden h-full">
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackProductImage;
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-900">{formatPrice(product.discountPrice || product.price)}</span>
                        {product.discountPrice && product.discountPrice < product.price && (
                          <span className="text-sm text-neutral-400 line-through">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Discounted Deals</h2>
            <p className="text-neutral-500">The best markdowns on products you love.</p>
          </div>
          <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700">Browse all discounts</Link>
        </div>
        {topDeals.length === 0 ? (
          <div className="rounded-3xl bg-neutral-100 p-10 text-center">
            <p className="text-lg font-semibold text-neutral-900">No discounted products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDeals.map((product: any) => (
              <motion.div key={product._id} whileHover={{ y: -4 }} className="group">
                <Link to={`/products/${product._id}`}>
                  <Card className="overflow-hidden h-full">
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackProductImage;
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-900">{formatPrice(product.discountPrice || product.price)}</span>
                        {product.discountPrice && product.discountPrice < product.price && (
                          <span className="text-sm text-neutral-400 line-through">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Best Selling</h2>
            <p className="text-neutral-500">Popular products with the most customer interest.</p>
          </div>
          <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700">See more best sellers</Link>
        </div>
        {bestSellers.length === 0 ? (
          <div className="rounded-3xl bg-neutral-100 p-10 text-center">
            <p className="text-lg font-semibold text-neutral-900">No best-selling products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product: any) => (
              <motion.div key={product._id} whileHover={{ y: -4 }} className="group">
                <Link to={`/products/${product._id}`}>
                  <Card className="overflow-hidden h-full">
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackProductImage;
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-900">{formatPrice(product.discountPrice || product.price)}</span>
                        {product.discountPrice && product.discountPrice < product.price && (
                          <span className="text-sm text-neutral-400 line-through">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
