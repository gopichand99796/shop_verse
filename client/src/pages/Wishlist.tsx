import { useQuery } from '@tanstack/react-query';
import { wishlist } from '../services/api';

export default function Wishlist() {
  const { data, isLoading } = useQuery({ queryKey: ['wishlist'], queryFn: () => wishlist.list() });
  const items = (data as any)?.data || [];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p: any) => (
            <div key={p._id} className="bg-white p-3 rounded shadow">
              <div className="h-40 bg-slate-100 mb-2" />
              <div className="font-medium">{p.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
