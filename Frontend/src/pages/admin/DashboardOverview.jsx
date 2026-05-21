import React, { useState, useEffect } from 'react';
import { Users, Building2, CalendarDays, DollarSign, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalHotels: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} color="bg-blue-500" />
        <StatCard title="Total Hotels" value={stats.totalHotels.toLocaleString()} icon={Building2} color="bg-indigo-500" />
        <StatCard title="Total Bookings" value={stats.totalBookings.toLocaleString()} icon={CalendarDays} color="bg-emerald-500" />
        <StatCard title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={DollarSign} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-center items-center">
          <p className="text-gray-400">Revenue Chart (Coming Soon)</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-center items-center">
          <p className="text-gray-400">Recent Bookings (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
