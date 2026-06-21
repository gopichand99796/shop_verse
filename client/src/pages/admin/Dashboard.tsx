import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../lib/utils';
import Card from '../../components/ui/Card';

const COLORS = ['#0ea5e9', '#d946ef', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
  // Mock data - in production, this would come from API
  const revenueData = [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 67000 },
  ];

  const ordersData = [
    { name: 'Mon', orders: 120 },
    { name: 'Tue', orders: 145 },
    { name: 'Wed', orders: 132 },
    { name: 'Thu', orders: 168 },
    { name: 'Fri', orders: 189 },
    { name: 'Sat', orders: 210 },
    { name: 'Sun', orders: 195 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home', value: 200 },
    { name: 'Sports', value: 150 },
    { name: 'Books', value: 100 },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$328,450',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-primary-500',
    },
    {
      title: 'Total Orders',
      value: '1,245',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'bg-accent-500',
    },
    {
      title: 'Total Products',
      value: '348',
      change: '+5.1%',
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: 'Total Customers',
      value: '2,847',
      change: '+15.3%',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: 129.99, status: 'completed', date: '2 min ago' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: 89.99, status: 'processing', date: '15 min ago' },
    { id: '#ORD-003', customer: 'Bob Johnson', amount: 249.99, status: 'pending', date: '1 hour ago' },
    { id: '#ORD-004', customer: 'Alice Williams', amount: 59.99, status: 'completed', date: '2 hours ago' },
    { id: '#ORD-005', customer: 'Charlie Brown', amount: 179.99, status: 'shipped', date: '3 hours ago' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <ArrowUpRight className="h-4 w-4" />
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</h3>
                <p className="text-neutral-500">{stat.title}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => formatPrice(Number(value))}
              />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Orders by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-neutral-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-6">Weekly Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line type="monotone" dataKey="orders" stroke="#d946ef" strokeWidth={3} dot={{ fill: '#d946ef', strokeWidth: 2, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-neutral-900">{order.id}</td>
                  <td className="py-4 px-4 text-sm text-neutral-600">{order.customer}</td>
                  <td className="py-4 px-4 text-sm font-medium text-neutral-900">{formatPrice(order.amount)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
