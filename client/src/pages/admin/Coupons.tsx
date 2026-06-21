import { useQuery } from '@tanstack/react-query';
import { products } from '../../services/api';

export default function AdminCoupons() {
  const { data } = useQuery({ queryKey: ['coupons-placeholder'], queryFn: () => products.list({ limit: 10 }) });
  const items = (data as any)?.data || [];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Coupons (admin)</h2>
      <div className="bg-white p-4 rounded">Placeholder — integrate /admin/coupons endpoints</div>
    </div>
  );
}
