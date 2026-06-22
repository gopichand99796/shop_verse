import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { wishlist } from '../services/api';

export default function Wishlist() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['wishlist'], queryFn: () => wishlist.list() });
  const toggleMutation = useMutation({
    mutationFn: (productId: string) => wishlist.toggle(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Wishlist updated');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Unable to update wishlist');
    }
  });
  const items = (data as any)?.data || [];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p: any) => (
            <div key={p._id} className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-slate-100 mb-4 rounded-xl overflow-hidden flex items-center justify-center">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="text-sm text-neutral-500">No Image</div>}
              </div>
              <div className="font-semibold text-neutral-900 mb-2 line-clamp-2">{p.name}</div>
              <div className="flex items-center justify-between gap-3 text-sm text-neutral-500 mb-4">
                <span>{p.brand || 'ShopVerse'}</span>
                <span>{p.price ? `$${p.price.toFixed(2)}` : ''}</span>
              </div>
              <button
                onClick={() => toggleMutation.mutate(p._id)}
                className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
