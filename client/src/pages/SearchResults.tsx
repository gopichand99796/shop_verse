import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { products } from '../services/api';

export default function SearchResults() {
  const [q] = useSearchParams();
  const qstr = q.get('q') || '';
  const { data, isLoading } = useQuery({ queryKey: ['search', qstr], queryFn: () => products.list({ search: qstr }), enabled: qstr.length > 0 });
  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : [];
  return (
    <div>
      <h2 className="text-xl mb-4">Search results for "{qstr}"</h2>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p: any) => (
            <Link to={`/products/${p._id}`} key={p._id} className="bg-white p-3 rounded shadow">
              <div className="h-40 bg-slate-100 mb-2 overflow-hidden rounded-xl">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-neutral-500">No Image</div>
                )}
              </div>
              <div className="font-medium mt-2">{p.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
