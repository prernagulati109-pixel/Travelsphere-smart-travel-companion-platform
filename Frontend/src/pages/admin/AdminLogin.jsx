import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginAdmin, currentAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If already logged in as admin, redirect to dashboard
    if (currentAdmin) {
      navigate('/admin/dashboard');
    }
  }, [currentAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginAdmin(email.trim(), password.trim());
      // The useEffect above will handle redirection once currentAdmin is set
    } catch (err) {
      console.error(err);
      setError('Invalid admin credentials. Please ensure you have admin access.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            TravelSphere Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure portal access
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-100">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email-address">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="admin@travelsphere.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-xl border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              &larr; Back to Main Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
