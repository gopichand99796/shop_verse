import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function AdminAnalytics() {
  const { data } = useQuery({ queryKey: ['analytics-revenue'], queryFn: () => api.get('/admin/analytics/revenue') });
  const rows = (data as any)?.data || [];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analytics (admin)</h2>
      <div className="bg-white p-4 rounded">
        <pre className="text-xs">{JSON.stringify(rows, null, 2)}</pre>
      </div>
    </div>
  );
}
