import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../store/authSlice.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Hexagon, Eye, EyeOff, AlertTriangle, Briefcase, GraduationCap, Building2 } from 'lucide-react';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
  });
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
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Please complete all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    const result = await dispatch(signup(formData));
    if (result.payload?.user) {
      toast.success('Registration successful.');
      const role = result.payload.user.role;
      navigate(`/dashboard/${role}`, { replace: true });
    }
  };

  const isStudent = formData.role === 'student';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans text-slate-900">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Brand & Value Prop */}
        <div className="md:w-5/12 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Abstract background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full mix-blend-screen" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-10">
              <Hexagon className="w-8 h-8 fill-indigo-500 text-indigo-500" />
              <span className="text-xl font-bold tracking-tight">EventMates</span>
            </div>
            
            <h2 className="text-3xl font-semibold mb-4 leading-tight">
              {isStudent ? 'Build your professional trajectory' : 'Scale your event operations'}
            </h2>
            <p className="text-slate-400 font-light leading-relaxed mb-10">
              {isStudent
                ? 'Access premier event opportunities, track your earnings, and develop a verifiable portfolio of experience.'
                : 'Connect with verified talent, manage applications, and streamline your recruitment process.'}
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                {isStudent ? <Briefcase className="w-5 h-5 text-indigo-400" /> : <Building2 className="w-5 h-5 text-indigo-400" />}
              </div>
              <div>
                <h4 className="font-medium text-slate-200">{isStudent ? 'Curated Postings' : 'Verified Candidates'}</h4>
                <p className="text-sm text-slate-400 mt-1 font-light">{isStudent ? 'Exclusive access to high-quality events.' : 'All profiles undergo a standardized review.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-12 lg:px-16 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Create an account</h1>
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">Sign in here</Link>
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                formData.role === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'organizer' }))}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                formData.role === 'organizer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Organizer
            </button>
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
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Corporate or University Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Must be at least 6 characters long.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : 'Register Account'}
            </button>
          </form>

          <p className="text-center mt-8 text-xs text-slate-500">
            By registering, you confirm you have read and agree to our{' '}
            <a href="#" className="underline hover:text-slate-700">Terms of Service</a> and{' '}
            <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
