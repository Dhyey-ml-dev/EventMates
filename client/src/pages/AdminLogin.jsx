import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'admin@eventmates.com',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    if (token && user) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) { setErrors({ email: 'Email is required' }); return; }
    if (!formData.password) { setErrors({ password: 'Password is required' }); return; }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.data) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminRefreshToken', data.data.refreshToken);
        localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        navigate('/admin');
      } else {
        setErrors({ submit: data.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrors({ submit: 'Request timeout. Please check if backend is running.' });
      } else {
        setErrors({ submit: 'Connection error. Please ensure backend is running on port 5001.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({ email: 'admin@eventmates.com', password: 'Admin@123456' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg"
          >
            EM
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">EventMates Admin</h1>
          <p className="text-white/60">Secure Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm"
              >
                ⚠️ {errors.submit}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@eventmates.com"
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-500/60 focus:ring-red-500/30' : 'border-white/20 focus:border-indigo-400 focus:ring-indigo-500/20'}`}
              />
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all pr-12 ${errors.password ? 'border-red-500/60 focus:ring-red-500/30' : 'border-white/20 focus:border-indigo-400 focus:ring-indigo-500/20'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-white/70 text-xs font-semibold mb-2">🔐 Demo Credentials:</p>
            <div className="text-xs text-white/60 space-y-1 font-mono">
              <p>Email: admin@eventmates.com</p>
              <p>Password: Admin@123456</p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="mt-3 w-full text-xs text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-400 py-1.5 rounded-lg transition-all font-semibold"
            >
              Auto-fill Demo Credentials
            </button>
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6 text-white/40 text-sm">
          <a href="/" className="hover:text-white/70 transition-colors underline">← Back to EventMates</a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
