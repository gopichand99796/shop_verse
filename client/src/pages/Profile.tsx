import { useQuery } from '@tanstack/react-query';
import { auth } from '../services/api';
import { motion } from 'framer-motion';
import { Shield, CalendarDays, PackageCheck, MapPin, Heart } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { format } from 'date-fns';

export default function Profile() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['me'],
    queryFn: () => auth.me(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-4xl">
          <div className="grid gap-6">
            <div className="h-28 rounded-3xl bg-neutral-100 animate-pulse" />
            <div className="h-96 rounded-3xl bg-neutral-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="min-h-screen flex items-center justify-center py-16 px-4 text-red-600">{(error as any)?.message || 'Unable to load profile'}</div>;
  }

  const user = (data as any)?.data || {};
  const joined = user.joined ? format(new Date(user.joined), 'MMMM d, yyyy') : 'Unknown';
  const addresses = user.addresses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-neutral-900">My Profile</h1>
            <p className="text-neutral-600 mt-2">Manage your account details, order history, and saved addresses.</p>
          </div>
          <Button size="lg">Edit Profile</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Account Information</h2>
                <p className="text-neutral-500">Your registered profile</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <Shield className="h-5 w-5 text-primary-500" />
                Secure account
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-neutral-50 p-6 border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-[0.2em] mb-3">Name</h3>
                <p className="text-lg font-semibold text-neutral-900">{user.name}</p>
              </div>
              <div className="rounded-3xl bg-neutral-50 p-6 border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-[0.2em] mb-3">Email</h3>
                <p className="text-lg font-semibold text-neutral-900">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-neutral-50 p-6 border border-neutral-200">
                <div className="flex items-center gap-3 mb-3 text-neutral-600">
                  <CalendarDays className="h-5 w-5 text-primary-500" />
                  <span className="font-medium">Joined</span>
                </div>
                <p className="text-neutral-900 font-semibold">{joined}</p>
              </div>
              <div className="rounded-3xl bg-neutral-50 p-6 border border-neutral-200">
                <div className="flex items-center gap-3 mb-3 text-neutral-600">
                  <PackageCheck className="h-5 w-5 text-primary-500" />
                  <span className="font-medium">Orders</span>
                </div>
                <p className="text-neutral-900 font-semibold">{user.ordersCount ?? 0}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Saved addresses</h3>
                  <p className="text-neutral-500">Shipping addresses stored for easy checkout.</p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>

              <div className="grid gap-4">
                {addresses.length === 0 ? (
                  <div className="rounded-3xl p-6 bg-neutral-50 border border-dashed border-neutral-300 text-neutral-500">
                    You have no saved addresses yet.
                  </div>
                ) : addresses.map((address: any) => (
                  <div key={address._id || address.label} className="rounded-3xl p-6 bg-neutral-50 border border-neutral-200">
                    <div className="text-neutral-900 font-semibold">{address.label || 'Home'}</div>
                    <div className="text-neutral-600 mt-1">{address.street}, {address.city}, {address.state}, {address.zip}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/80">Quick stats</p>
                  <h3 className="text-2xl font-semibold">Personal dashboard</h3>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm text-white/80">Active wishlist items</p>
                  <p className="text-3xl font-semibold">{user.wishlistCount ?? 0}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm text-white/80">Pending orders</p>
                  <p className="text-3xl font-semibold">{user.pendingOrders ?? 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Account settings</h3>
              <div className="space-y-4">
                <button className="w-full rounded-3xl border border-neutral-200 px-5 py-4 text-left hover:border-primary-500 transition-colors">
                  <span className="font-medium">Change password</span>
                  <p className="text-sm text-neutral-500 mt-1">Keep your account secure.</p>
                </button>
                <button className="w-full rounded-3xl border border-neutral-200 px-5 py-4 text-left hover:border-primary-500 transition-colors">
                  <span className="font-medium">Notification preferences</span>
                  <p className="text-sm text-neutral-500 mt-1">Manage email updates.</p>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
