import { useQuery } from '@tanstack/react-query';
import { products } from '../services/api';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const { data, isLoading } = useQuery({ queryKey: ['products', { page: 1, limit: 20 }], queryFn: () => products.list({ page: 1, limit: 20 }) });
  const items = (data as any)?.data?.items || [];
  const err = (data as any)?.success === false ? (data as any)?.message : null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {isLoading ? <div>Loading...</div> : err ? <div className="text-red-600">{err}</div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p: any) => (
            <Link to={`/products/${p._id}`} key={p._id} className="bg-white p-3 rounded shadow">
              <div className="h-40 bg-slate-100 mb-2" />
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-slate-500">${p.price}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
