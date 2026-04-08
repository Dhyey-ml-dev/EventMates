import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  ChevronDown, LayoutDashboard, Search, LogOut, Hexagon, Calendar, Menu, X, Plus
} from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events Directory', path: '/events' },
    { label: 'Our Mission', path: '/about' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/dashboard/student';
    if (user.role === 'organizer') return '/dashboard/organizer';
    if (user.role === 'admin') return '/admin';
    return '/dashboard/student';
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 font-sans ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100 py-3'
          : 'bg-white py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Hexagon className="w-5 h-5 fill-white text-slate-900" />
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline tracking-tight">
              EventMates
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'organizer' && (
                  <button
                    onClick={() => navigate('/organizer/post-event')}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Listing
                  </button>
                )}

                <Link
                  to={getDashboardPath()}
                  className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors hidden lg:block"
                >
                  Dashboard
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 pr-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                      {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-slate-700 text-sm font-medium">{user?.firstName}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="font-semibold text-slate-900 text-sm truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500 truncate mb-1">{user?.email}</p>
                      <span className="inline-block bg-white border border-slate-200 text-slate-600 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-semibold">
                        {user?.role}
                      </span>
                    </div>
                    <div className="p-2">
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard Console
                      </Link>
                      <Link
                        to="/events"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Browse Opportunities
                      </Link>
                      <hr className="my-2 border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive(link.path)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{user?.firstName} {user?.lastName}</p>
                        <p className="text-slate-500 text-xs text-transform: capitalize">{user?.role}</p>
                      </div>
                    </div>

                    {user?.role === 'organizer' && (
                      <button
                        onClick={() => navigate('/organizer/post-event')}
                        className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        New Listing
                      </button>
                    )}

                    <div className="space-y-1">
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard Console
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-medium"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
