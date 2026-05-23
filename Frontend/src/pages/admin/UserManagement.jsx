import React, { useState, useEffect } from 'react';
import { Users, Shield, ShieldAlert, Trash2, Search, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data if API is not fully ready
  const mockUsers = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2023-01-15' },
    { _id: '2', name: 'Admin User', email: 'admin@travelsphere.com', role: 'admin', createdAt: '2023-01-10' },
    { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2023-02-20' },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminApi.getUsers();
        if (data && data.success) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAction = async (userId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        if (action === 'promote') {
          await adminApi.updateUserRole(userId, true);
        } else if (action === 'block') {
          await adminApi.banUser(userId, true);
        } else if (action === 'unblock') {
          await adminApi.banUser(userId, false);
        } else if (action === 'delete') {
          await adminApi.deleteUser(userId);
        }
        
        // Refresh users
        const data = await adminApi.getUsers();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error(`Failed to ${action} user`, error);
        alert(`Failed to ${action} user. Please try again.`);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage user accounts, roles, and access.</p>
        </div>
        
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        user.isAdmin 
                          ? 'bg-purple-50 text-purple-700 ring-purple-700/10' 
                          : user.isBanned
                          ? 'bg-red-50 text-red-700 ring-red-700/10'
                          : 'bg-green-50 text-green-700 ring-green-700/10'
                      }`}>
                        {user.isAdmin && <Shield size={12} />}
                        {user.isAdmin ? 'Admin' : user.isBanned ? 'Blocked' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {!user.isAdmin && (
                          <button 
                            onClick={() => handleAction(user._id, 'promote')}
                            className="rounded-lg p-2 text-purple-600 hover:bg-purple-50 transition-colors tooltip"
                            title="Promote to Admin"
                          >
                            <Shield size={18} />
                          </button>
                        )}
                        {!user.isBanned && !user.isAdmin && (
                          <button 
                            onClick={() => handleAction(user._id, 'block')}
                            className="rounded-lg p-2 text-orange-600 hover:bg-orange-50 transition-colors tooltip"
                            title="Block User"
                          >
                            <ShieldAlert size={18} />
                          </button>
                        )}
                        {user.isBanned && !user.isAdmin && (
                          <button 
                            onClick={() => handleAction(user._id, 'unblock')}
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50 transition-colors tooltip"
                            title="Unblock User"
                          >
                            <Shield size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleAction(user._id, 'delete')}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors tooltip"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
