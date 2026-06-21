import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { products, admin } from '../../services/api';

export default function AdminProducts() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-products'], queryFn: () => products.list({ limit: 200 }) });
  const del = useMutation({ mutationFn: (id: string) => admin.products.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }) });
  const items = (data as any)?.data || [];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products (admin)</h2>
      {isLoading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {items.map((p: any) => (
            <div key={p._id} className="bg-white p-3 rounded flex items-center justify-between">
              <div>{p.name}</div>
              <div className="space-x-2">
                <button className="text-sm text-sky-600">Edit</button>
                <button className="text-sm text-red-600" onClick={() => del.mutate(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
