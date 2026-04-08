import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/authSlice.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Hexagon, Eye, EyeOff, AlertTriangle, ShieldCheck, PieChart, Users } from 'lucide-react';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Credentials are required.');
      return;
    }
    const result = await dispatch(login(formData));
    if (result.payload?.user) {
      toast.success('Authentication successful.');
      const role = result.payload.user.role;
      navigate(`/dashboard/${role}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans text-slate-900">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Panel */}
        <div className="hidden md:flex md:w-5/12 flex-col justify-between p-8 md:p-12 bg-slate-900 text-white relative overflow-hidden">
          {/* Abstract geometric background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-1/4 right-[-20%] w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full mix-blend-screen" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-12">
              <Hexagon className="w-8 h-8 fill-indigo-500 text-indigo-500" />
              <span className="text-xl font-bold tracking-tight">EventMates</span>
            </div>
            
            <h2 className="text-3xl font-semibold mb-4 leading-tight">
              Sign in to your console
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
              Manage your event operations, review candidate applications, or track your engagement portfolio securely.
            </p>
          </div>

          <div className="relative z-10 space-y-5">
            {[
              { icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />, title: 'Enterprise Security', desc: 'Encrypted end-to-end data.' },
              { icon: <PieChart className="w-5 h-5 text-indigo-400" />, title: 'Analytics Engine', desc: 'Real-time performance tracking.' },
              { icon: <Users className="w-5 h-5 text-indigo-400" />, title: 'Verified Network', desc: 'Quality-assured talent pool.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-medium text-slate-200 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:px-16 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">Create one here</Link>
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800 text-sm"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <p className="mt-0.5">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex justify-between">
                <span>Password</span>
                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-700 text-xs">Forgot password?</a>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-12 font-sans"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-slate-900 text-white py-3.5 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Test Credentials block */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-slate-600">
               <ShieldCheck className="w-4 h-4" />
               <p className="text-xs font-semibold uppercase tracking-wider">Evaluation Credentials</p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500 font-light">
              <p>Candidate: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">student@test.com</span> / <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">password123</span></p>
              <p>Organizer: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">organizer@test.com</span> / <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">password123</span></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
