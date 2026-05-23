import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  Users, 
  MessageSquare, 
  BarChart3,
  Map,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const { currentAdmin, logoutAdmin } = useAdmin();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hotels', path: '/admin/hotels', icon: Building2 },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Packages', path: '/admin/packages', icon: Map },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            TravelSphere Admin
          </span>
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100vh-4rem)]">
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-gray-100 p-4">
            <div className="mb-4 flex items-center gap-3 px-3">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {currentAdmin?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-gray-900">{currentAdmin?.name || 'Administrator'}</p>
                <p className="truncate text-xs text-gray-500">{currentAdmin?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8 shadow-sm">
          <button 
            className="text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            {/* Can add notifications or search here in future */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
