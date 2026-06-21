export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded">Revenue</div>
        <div className="bg-white p-4 rounded">Orders</div>
        <div className="bg-white p-4 rounded">Top products</div>
      </div>
    </div>
  );
}
