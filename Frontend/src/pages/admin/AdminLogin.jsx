import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Check your credentials and admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20">
        
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-300">Secure access to TravelSphere management</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-500/20 p-4 text-sm text-red-200 border border-red-500/50">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-gray-600 bg-gray-800/50 py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="admin@travelsphere.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-gray-600 bg-gray-800/50 py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-blue-600 py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </span>
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} TravelSphere Admin Portal.</p>
          <p className="mt-1">Authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
