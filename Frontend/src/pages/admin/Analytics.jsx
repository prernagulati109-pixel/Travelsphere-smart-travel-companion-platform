import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { CalendarDays, DollarSign, TrendingUp } from 'lucide-react';

const Analytics = () => {
  // Mock data for comprehensive analytics
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 4000, expected: 3500 },
    { name: 'Feb', revenue: 3000, expected: 3200 },
    { name: 'Mar', revenue: 5000, expected: 4000 },
    { name: 'Apr', revenue: 4500, expected: 4800 },
    { name: 'May', revenue: 6000, expected: 5500 },
    { name: 'Jun', revenue: 8000, expected: 7000 },
  ];

  const bookingsByStatusData = [
    { name: 'Approved', value: 65 },
    { name: 'Pending', value: 20 },
    { name: 'Cancelled', value: 15 },
  ];

  const destinationData = [
    { name: 'Goa', value: 400 },
    { name: 'Manali', value: 300 },
    { name: 'Kerala', value: 300 },
    { name: 'Jaipur', value: 200 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-500 mt-1">Detailed insights into your platform's performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="rounded-full p-4 bg-blue-50 text-blue-600"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Growth Rate</p>
            <p className="text-2xl font-bold text-gray-900">+12.5%</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="rounded-full p-4 bg-green-50 text-green-600"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg. Revenue per User</p>
            <p className="text-2xl font-bold text-gray-900">₹4,250</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="rounded-full p-4 bg-purple-50 text-purple-600"><CalendarDays size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg. Booking Duration</p>
            <p className="text-2xl font-bold text-gray-900">3.2 Days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Line Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue vs Expected</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="expected" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Status Bar Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Booking Status Distribution</h3>
          <div className="h-[300px] w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingsByStatusData}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={5} dataKey="value" stroke="none"
                >
                  {bookingsByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
