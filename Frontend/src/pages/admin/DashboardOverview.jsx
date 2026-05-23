import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, Building2, Map, IndianRupee, MessageSquare, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-xl border border-white/40 transition-all hover:-translate-y-1 hover:shadow-2xl`}>
    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-20 ${gradient} blur-2xl`}></div>
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`rounded-xl p-3 bg-gradient-to-br ${gradient} shadow-lg`}>
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
    totalPackages: 0,
    revenue: 0,
    contactMessages: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000, bookings: 24 },
    { name: 'Feb', revenue: 3000, bookings: 18 },
    { name: 'Mar', revenue: 5000, bookings: 35 },
    { name: 'Apr', revenue: 4500, bookings: 28 },
    { name: 'May', revenue: 6000, bookings: 42 },
    { name: 'Jun', revenue: 8000, bookings: 55 },
  ];

  const destinationData = [
    { name: 'Goa', value: 400 },
    { name: 'Manali', value: 300 },
    { name: 'Kerala', value: 300 },
    { name: 'Jaipur', value: 200 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        if (data.success) {
          setStats({
            ...data.data,
            contactMessages: 15 // Mock data or fetched if available
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to mock if API fails
        setStats({
          totalUsers: 1254,
          totalBookings: 342,
          totalHotels: 45,
          totalPackages: 14,
          revenue: 1250000,
          contactMessages: 15
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back to the TravelSphere admin panel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard title="Total Users" value={stats.totalUsers?.toLocaleString() || 0} icon={Users} gradient="from-blue-500 to-cyan-400" />
        <StatCard title="Total Bookings" value={stats.totalBookings?.toLocaleString() || 0} icon={CalendarDays} gradient="from-emerald-500 to-teal-400" />
        <StatCard title="Total Hotels" value={stats.totalHotels?.toLocaleString() || 0} icon={Building2} gradient="from-amber-500 to-orange-400" />
        <StatCard title="Travel Packages" value={stats.totalPackages?.toLocaleString() || 0} icon={Map} gradient="from-indigo-500 to-purple-400" />
        <StatCard title="Revenue" value={`₹${(stats.revenue || 0).toLocaleString()}`} icon={IndianRupee} gradient="from-purple-500 to-pink-400" />
        <StatCard title="Messages" value={stats.contactMessages?.toLocaleString() || 0} icon={MessageSquare} gradient="from-rose-500 to-pink-400" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-xl border border-white/40 hover:shadow-2xl transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue & Bookings Trend</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Destinations Pie Chart */}
        <div className="rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-xl border border-white/40 hover:shadow-2xl transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Popular Destinations</h3>
          <div className="h-[350px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={destinationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {destinationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
