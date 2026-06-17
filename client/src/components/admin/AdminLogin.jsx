import React, { useState } from 'react';
import axios from 'axios';
import useMenuStore from '../../store/useMenuStore';
import ErrorBanner from '../ui/ErrorBanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AdminLogin = () => {
  const { setAdminToken } = useMenuStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/admin/auth/login`, {
        email,
        password
      });

      if (response.data && response.data.status === 'success') {
        const { token } = response.data.data;
        setAdminToken(token);
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4">
      <div className="card p-8 shadow-xl bg-surface-white">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-wide uppercase text-text-dark mb-2">
            Admin Portal
          </h2>
          <p className="text-accent-taupe text-xs">
            Sign in to manage the cafe's digital menu
          </p>
        </div>

        {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-text-dark/80 text-xs font-semibold uppercase tracking-wider pl-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@silvertipcafe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-dark/80 text-xs font-semibold uppercase tracking-wider pl-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-lg active:scale-95 disabled:opacity-50 disabled:scale-100 mt-2"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
