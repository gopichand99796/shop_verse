import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cart } from '../services/api';

export default function CartPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['cart'], queryFn: () => cart.get() });
  const remove = useMutation({ mutationFn: (id: string) => cart.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) });

  const items = (data as any)?.data?.items || [];
  const err = (data as any)?.error || (data as any)?.message || null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      {isLoading ? <div>Loading...</div> : err ? <div className="text-red-600">{err}</div> : (
        <div className="space-y-3">
          {items.map((it: any) => (
            <div key={it._id} className="bg-white p-3 rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{it.product.name}</div>
                <div className="text-sm">Qty: {it.qty}</div>
              </div>
              <div>
                <button className="text-sm text-red-500" onClick={() => remove.mutate(it._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
