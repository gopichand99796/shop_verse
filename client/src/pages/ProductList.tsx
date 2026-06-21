import { useQuery } from '@tanstack/react-query';
import { products, categories } from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../lib/utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { page: 1, limit: 24, category: categoryParam, search: searchParam, sortBy }],
    queryFn: () => products.list({ page: 1, limit: 24, category: categoryParam, search: searchParam, sortBy })
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categories.list()
  });

  // Log API response to debug shape
  console.log('Products API Response:', productsData);
  console.log('Categories API Response:', categoriesData);

  // Handle different response shapes: raw array, { data: [...] }, { success: true, data: [...] }, { data: { items: [...] } }
  const productList = Array.isArray(productsData) 
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

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            {categoryParam ? categoriesList.find((c: any) => c.slug === categoryParam)?.name || 'Products' : 'All Products'}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-neutral-600">
              {productList.length} products found
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className={`w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categoriesLoading ? (
                    [...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)
                  ) : (
                    categoriesList.map((category: any) => (
                      <label key={category._id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => toggleCategory(category._id)}
                          className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-neutral-700">{category.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-500">$</span>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-500">$</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {selectedCategories.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Active Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((catId) => {
                      const cat = categoriesList.find((c: any) => c._id === catId);
                      return cat ? (
                        <Badge key={catId} variant="primary" className="flex items-center gap-1">
                          {cat.name}
                          <button
                            onClick={() => toggleCategory(catId)}
                            className="ml-1 hover:text-primary-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : productList.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productList.map((product: any, index: number) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/products/${product._id}`}>
                      <Card className="group h-full hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden">
                        <div className="relative">
                          <div className="aspect-square bg-neutral-100 overflow-hidden">
                            <img
                              src={product.images?.[0] || 'https://via.placeholder.com/400x400'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {product.discountPrice && product.discountPrice < product.price && (
                            <div className="absolute top-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Sale
                            </div>
                          )}
                          {product.stock < 10 && product.stock > 0 && (
                            <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Low Stock
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Out of Stock
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {product.name}
                          </h3>
                          {product.category && (
                            <p className="text-sm text-neutral-500 mb-2">{product.category.name || product.category}</p>
                          )}
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
        </div>
      </div>
    </div>
  );
}
