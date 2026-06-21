import { useQuery } from '@tanstack/react-query';
import { products } from '../services/api';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['product', id], queryFn: () => products.get(id || ''), enabled: !!id });
  const p = (data as any)?.data;
  const err = (data as any)?.error || (data as any)?.message || null;
  if (isLoading) return <div>Loading...</div>;
  if (err) return <div className="text-red-600">{err}</div>;
  if (!p) return <div>Product not found</div>;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="h-96 bg-slate-100" />
      <div>
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <p className="mt-2 text-slate-600">{p.description}</p>
        <div className="mt-4 text-xl font-semibold">${p.price}</div>
      </div>
    </div>
  );
}
