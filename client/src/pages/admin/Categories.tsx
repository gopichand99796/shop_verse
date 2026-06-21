import { useQuery } from '@tanstack/react-query';
import { products } from '../../services/api';

export default function AdminCategories() {
  // backend category endpoints can be added; for now reuse products listing for context
  const { data } = useQuery({ queryKey: ['categories-placeholder'], queryFn: () => products.list({ limit: 10 }) });
  const items = (data as any)?.data || [];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Categories (admin)</h2>
      <div className="bg-white p-4 rounded">Found {items.length} items (placeholder)</div>
    </div>
  );
}
