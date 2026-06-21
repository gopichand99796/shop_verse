import { useQuery } from '@tanstack/react-query';
import { admin, orders } from '../../services/api';

export default function AdminOrders() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-orders'], queryFn: () => admin.products ? orders.list() : orders.list() });
  const items = (data as any)?.data || [];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders (admin)</h2>
      {isLoading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {items.map((o: any) => (
            <div key={o._id} className="bg-white p-3 rounded">
              <div>Order {o._id} — ${o.total}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
