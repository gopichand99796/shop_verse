import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function AdminAnalytics() {
  const { data: revenueData } = useQuery({ queryKey: ['analytics-revenue'], queryFn: () => api.get('/admin/analytics/revenue').then(r => r.data) });
  const { data: categoryData } = useQuery({ queryKey: ['analytics-category'], queryFn: () => api.get('/admin/analytics/sales-by-category').then(r => r.data) });
  const { data: productsData } = useQuery({ queryKey: ['analytics-products'], queryFn: () => api.get('/admin/analytics/top-products').then(r => r.data) });
  const { data: signupsData } = useQuery({ queryKey: ['analytics-signups'], queryFn: () => api.get('/admin/analytics/signups').then(r => r.data) });
  const { data: aovData } = useQuery({ queryKey: ['analytics-aov'], queryFn: () => api.get('/admin/analytics/aov').then(r => r.data) });
  const { data: conversionData } = useQuery({ queryKey: ['analytics-conversion'], queryFn: () => api.get('/admin/analytics/conversion').then(r => r.data) });

  const revenue = Array.isArray(revenueData) ? revenueData : (revenueData as any)?.data || [];
  const category = Array.isArray(categoryData) ? categoryData : (categoryData as any)?.data || [];
  const products = Array.isArray(productsData) ? productsData : (productsData as any)?.data || [];
  const signups = Array.isArray(signupsData) ? signupsData : (signupsData as any)?.data || [];
  const aov = aovData;
  const conversion = conversionData;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analytics (admin)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2">Revenue</h3>
          <pre className="text-xs">{JSON.stringify(revenue, null, 2)}</pre>
        </div>
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2">Sales by Category</h3>
          <pre className="text-xs">{JSON.stringify(category, null, 2)}</pre>
        </div>
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2">Top Products</h3>
          <pre className="text-xs">{JSON.stringify(products, null, 2)}</pre>
        </div>
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2">Signups</h3>
          <pre className="text-xs">{JSON.stringify(signups, null, 2)}</pre>
        </div>
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2">Average Order Value</h3>
          <pre className="text-xs">{JSON.stringify(aov, null, 2)}</pre>
        </div>
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2">Conversion Rate</h3>
          <pre className="text-xs">{JSON.stringify(conversion, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
