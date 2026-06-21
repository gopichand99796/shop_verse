import { useQuery } from '@tanstack/react-query';
import { orders } from '../services/api';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => orders.list() });
  const items = (data as any)?.data || [];
  const err = (data as any)?.error || (data as any)?.message || null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
      {isLoading ? <div>Loading...</div> : err ? <div className="text-red-600">{err}</div> : (
        <div className="space-y-3">
          {items.map((o: any) => (
            <div key={o._id} className="bg-white p-3 rounded flex items-center justify-between">
              <div>
                <div className="font-medium">Order {o._id}</div>
                <div className="text-sm">Total ${o.total}</div>
              </div>
              <Link to={`/orders/${o._id}`} className="text-sm text-sky-600">View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
