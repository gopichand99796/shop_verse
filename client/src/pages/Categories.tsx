import { useQuery } from '@tanstack/react-query';
import { categories } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

export default function Categories() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categories.list(),
  });

  const categoriesList = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : [];

  console.log('Categories Page - API Response:', data);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">Categories</h1>
          <p className="text-neutral-600 mt-2">Browse categories and find products tailored to your interests.</p>
        </div>
        <Link to="/products" className="px-5 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
          View All Products
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-3xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-8 text-center">
          <p className="text-red-700 font-semibold mb-2">Unable to load categories</p>
          <p className="text-red-600">{(error as any)?.message || 'Please refresh the page.'}</p>
        </div>
      ) : categoriesList.length === 0 ? (
        <div className="rounded-3xl bg-neutral-100 p-10 text-center">
          <p className="text-lg font-semibold text-neutral-900">No categories available</p>
          <p className="text-neutral-600 mt-2">Please check back later or view all products instead.</p>
          <div className="mt-6">
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((category: any, index: number) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/products?category=${category._id}`}>
                <Card className="group h-full overflow-hidden hover:shadow-medium transition-all duration-300 cursor-pointer">
                  <div className="p-8 flex flex-col items-start gap-4 h-full">
                    <div className="w-16 h-16 rounded-3xl bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
                      {category.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">{category.name}</h2>
                      {category.description && <p className="text-neutral-500 mt-2">{category.description}</p>}
                    </div>
                    <div className="mt-auto text-sm text-primary-600 font-medium">Shop now →</div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
