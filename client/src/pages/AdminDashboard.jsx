import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5001/api';

const getAdminToken = () => localStorage.getItem('adminToken');

const apiFetch = async (url, options = {}) => {
  const token = getAdminToken();
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  return response.json();
};

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <motion.div
    whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
    className={`bg-white p-6 rounded-2xl shadow-md border-l-4 ${color} transition-all`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </motion.div>
);

const EmptyState = ({ message, icon = '📭' }) => (
  <div className="text-center py-16">
    <div className="text-5xl mb-4">{icon}</div>
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

const Badge = ({ status }) => {
  const colors = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    active: 'bg-green-100 text-green-700',
    blocked: 'bg-red-100 text-red-700',
    pending: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentAnalytics, setPaymentAnalytics] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalRevenue: '₹0',
    pendingVerifications: 0,
    blockedUsers: 0,
    totalStudents: 0,
    totalOrganizers: 0,
    totalApplications: 0,
  });

  const emptyForm = {
    title: '',
    description: '',
    location: '',
    eventDate: '',
    eventEndDate: '',
    startTime: '09:00',
    endTime: '17:00',
    category: 'Technology',
    pay: { amount: 0, paymentType: 'fixed' },
    maxApplicants: 50,
    requirements: '',
    isFeatured: false,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (admin) setAdminUser(JSON.parse(admin));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await apiFetch('/admin/dashboard/stats');
      if (data.success) setStats(data.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/events?limit=50');
      if (data.success) setEvents(data.data || []);
      else toast.error(data.message || 'Failed to fetch events');
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/volunteers?limit=50');
      if (data.success) setVolunteers(data.data || []);
      else toast.error(data.message || 'Failed to fetch volunteers');
    } catch (error) {
      toast.error('Failed to fetch volunteers');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/users?limit=50');
      if (data.success) setUsers(data.data || []);
      else toast.error(data.message || 'Failed to fetch users');
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/payments');
      if (data.success) {
        setPayments(data.data || []);
        setPaymentAnalytics(data.analytics || {});
      }
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.eventDate) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const url = editingEvent
        ? `/admin/events/${editingEvent._id}/update`
        : '/admin/events/create';
      const method = editingEvent ? 'PATCH' : 'POST';

      const data = await apiFetch(url, {
        method,
        body: JSON.stringify({
          ...formData,
          requirements: typeof formData.requirements === 'string'
            ? formData.requirements.split(',').map(r => r.trim()).filter(Boolean)
            : formData.requirements,
        }),
      });

      if (data.success) {
        toast.success(editingEvent ? 'Event updated!' : 'Event created!');
        setShowEventModal(false);
        setFormData(emptyForm);
        setEditingEvent(null);
        fetchEvents();
        fetchDashboardData();
      } else {
        toast.error(data.message || 'Failed to save event');
      }
    } catch (error) {
      toast.error('Error saving event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const data = await apiFetch(`/admin/events/${eventId}/delete`, { method: 'DELETE' });
      if (data.success) {
        toast.success('Event deleted!');
        setEvents(prev => prev.filter(e => e._id !== eventId));
        fetchDashboardData();
      } else {
        toast.error(data.message || 'Failed to delete event');
      }
    } catch (error) {
      toast.error('Error deleting event');
    }
  };

  const handleToggleFeatured = async (eventId, current) => {
    try {
      const data = await apiFetch(`/admin/events/${eventId}/update`, {
        method: 'PATCH',
        body: JSON.stringify({ isFeatured: !current }),
      });
      if (data.success) {
        toast.success(`Event ${!current ? 'featured' : 'unfeatured'}!`);
        fetchEvents();
      }
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleVerifyVolunteer = async (volunteerId) => {
    try {
      const data = await apiFetch(`/admin/volunteers/${volunteerId}/verify`, { method: 'PATCH' });
      if (data.success) {
        toast.success('Volunteer verified!');
        setVolunteers(prev => prev.map(v => v._id === volunteerId ? { ...v, isVerified: true } : v));
      }
    } catch (error) {
      toast.error('Error verifying volunteer');
    }
  };

  const handleBlockUser = async (userId, currentlyBlocked) => {
    const action = currentlyBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const data = await apiFetch(`/admin/users/${userId}/block`, {
        method: 'PATCH',
        body: JSON.stringify({ block: !currentlyBlocked }),
      });
      if (data.success) {
        toast.success(`User ${action}ed!`);
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isSuspended: !currentlyBlocked } : u));
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleEditEvent = (event) => {
    setFormData({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
      eventEndDate: event.eventEndDate ? event.eventEndDate.split('T')[0] : '',
      startTime: event.startTime || '09:00',
      endTime: event.endTime || '17:00',
      category: event.category || 'Technology',
      pay: event.pay || { amount: 0, paymentType: 'fixed' },
      maxApplicants: event.maxApplicants || 50,
      requirements: Array.isArray(event.requirements) ? event.requirements.join(', ') : '',
      isFeatured: event.isFeatured || false,
    });
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'events', label: '🗓️ Events' },
    { id: 'volunteers', label: '👥 Volunteers' },
    { id: 'users', label: '🧑‍💼 Users' },
    { id: 'payments', label: '💳 Payments' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold">EM</div>
            <div>
              <h1 className="text-xl font-bold">EventMates Admin</h1>
              <p className="text-white/70 text-xs">Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/70">Logged in as</p>
              <p className="text-sm font-semibold">{adminUser?.email || 'admin@eventmates.com'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Logout →
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon="👤" color="border-blue-500" />
          <StatCard title="Students" value={stats.totalStudents} icon="🎓" color="border-indigo-500" />
          <StatCard title="Organizers" value={stats.totalOrganizers} icon="🏢" color="border-purple-500" />
          <StatCard title="Total Events" value={stats.totalEvents} icon="📅" color="border-green-500" />
          <StatCard title="Active Events" value={stats.activeEvents} icon="⚡" color="border-yellow-500" />
          <StatCard title="Revenue" value={stats.totalRevenue || '₹0'} icon="💰" color="border-emerald-500" />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'events') fetchEvents();
                  if (tab.id === 'volunteers') fetchVolunteers();
                  if (tab.id === 'users') fetchUsers();
                  if (tab.id === 'payments') fetchPayments();
                }}
                className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <p className="text-blue-700 text-sm mb-2">Pending Verifications</p>
                      <p className="text-3xl font-bold text-blue-900">{stats.pendingVerifications || 0}</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <p className="text-purple-700 text-sm mb-2">Total Applications</p>
                      <p className="text-3xl font-bold text-purple-900">{stats.totalApplications || 0}</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <p className="text-green-700 text-sm mb-2">Completed Events</p>
                      <p className="text-3xl font-bold text-green-900">{stats.completedEvents || 0}</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                      <p className="text-red-700 text-sm mb-2">Blocked Users</p>
                      <p className="text-3xl font-bold text-red-900">{stats.blockedUsers || 0}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setActiveTab('events'); fetchEvents(); setShowEventModal(true); }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                    >
                      ➕ Create Event
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setActiveTab('volunteers'); fetchVolunteers(); }}
                      className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200"
                    >
                      👥 Manage Volunteers
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setActiveTab('users'); fetchUsers(); }}
                      className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200"
                    >
                      🧑‍💼 Manage Users
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => fetchDashboardData()}
                      className="bg-emerald-100 text-emerald-800 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-200"
                    >
                      🔄 Refresh Stats
                    </motion.button>
                  </div>
                  <div className="mt-8 p-5 bg-indigo-50 rounded-xl border border-indigo-200">
                    <h4 className="text-indigo-800 font-bold mb-2">🔐 Admin Credentials (Demo)</h4>
                    <div className="text-sm text-indigo-700 space-y-1">
                      <p><strong>Email:</strong> admin@eventmates.com</p>
                      <p><strong>Password:</strong> Admin@123456</p>
                    </div>
                  </div>
                </div>
              )}

              {/* EVENTS TAB */}
              {activeTab === 'events' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setEditingEvent(null); setFormData(emptyForm); setShowEventModal(true); }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2"
                    >
                      ➕ New Event
                    </motion.button>
                  </div>

                  {loading ? (
                    <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div><p className="text-gray-500 mt-3">Loading events...</p></div>
                  ) : events.length > 0 ? (
                    <div className="space-y-3">
                      {events.map((event) => (
                        <motion.div
                          key={event._id}
                          whileHover={{ x: 4 }}
                          className="p-5 border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all bg-white"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">{event.title}</h3>
                                {event.isFeatured && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-semibold">⭐ Featured</span>}
                                {event.isSample && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">Sample</span>}
                              </div>
                              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{event.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <span>📍 {event.location}</span>
                                <span>📅 {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                                <span>👥 {event.applicants?.length || 0} applicants</span>
                                <span className="text-green-600 font-semibold">₹{event.pay?.amount || 0}</span>
                              </div>
                              <div className="mt-2">
                                <Badge status={event.status} />
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleToggleFeatured(event._id, event.isFeatured)}
                                className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 text-sm"
                                title="Toggle Featured"
                              >
                                ⭐
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleEditEvent(event)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                              >
                                ✏️
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteEvent(event._id, event.title)}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                              >
                                🗑️
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No events yet. Create one to get started!" icon="🗓️" />
                  )}
                </div>
              )}

              {/* VOLUNTEERS TAB */}
              {activeTab === 'volunteers' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Management</h2>
                  {loading ? (
                    <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div><p className="text-gray-500 mt-3">Loading volunteers...</p></div>
                  ) : volunteers.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Name</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Email</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Skills</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm hidden md:table-cell">Status</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {volunteers.map((v) => (
                            <tr key={v._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 font-medium text-gray-900">{v.firstName} {v.lastName}</td>
                              <td className="py-3 px-4 text-gray-600 text-sm">{v.email}</td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {(v.skills || []).slice(0, 2).map((s, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell">
                                <Badge status={v.isVerified ? 'active' : 'pending'} />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  {!v.isVerified && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                      onClick={() => handleVerifyVolunteer(v._id)}
                                      className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100"
                                    >
                                      ✓ Verify
                                    </motion.button>
                                  )}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => handleBlockUser(v._id, v.isSuspended)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${v.isSuspended ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                                  >
                                    {v.isSuspended ? '✓ Unblock' : '⊘ Block'}
                                  </motion.button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState message="No volunteers registered yet." icon="👥" />
                  )}
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
                  {loading ? (
                    <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div><p className="text-gray-500 mt-3">Loading users...</p></div>
                  ) : users.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Name</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Email</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Role</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm hidden md:table-cell">Joined</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                              <td className="py-3 px-4 text-gray-600 text-sm">{u.email}</td>
                              <td className="py-3 px-4">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                                  u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                  u.role === 'organizer' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>{u.role}</span>
                              </td>
                              <td className="py-3 px-4 text-gray-500 text-sm hidden md:table-cell">
                                {new Date(u.createdAt).toLocaleDateString('en-IN')}
                              </td>
                              <td className="py-3 px-4">
                                <Badge status={u.isSuspended ? 'blocked' : 'active'} />
                              </td>
                              <td className="py-3 px-4">
                                {u.role !== 'admin' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => handleBlockUser(u._id, u.isSuspended)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${u.isSuspended ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                                  >
                                    {u.isSuspended ? '✓ Unblock' : '⊘ Block'}
                                  </motion.button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState message="No users registered yet." icon="🧑‍💼" />
                  )}
                </div>
              )}

              {/* PAYMENTS TAB */}
              {activeTab === 'payments' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Management</h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <p className="text-emerald-700 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-emerald-900">{paymentAnalytics.totalRevenue || '₹0'}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-blue-700 text-sm">Total Transactions</p>
                      <p className="text-2xl font-bold text-blue-900">{paymentAnalytics.totalTransactions || 0}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <p className="text-purple-700 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-purple-900">{paymentAnalytics.completedTransactions || 0}</p>
                    </div>
                  </div>
                  {loading ? (
                    <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></div>
                  ) : payments.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">User</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Event</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Amount</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((p) => (
                            <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {p.userId?.firstName} {p.userId?.lastName}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{p.eventId?.title || 'N/A'}</td>
                              <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                ₹{((p.amount || 0) / 100).toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-4"><Badge status={p.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState message="No payment transactions yet." icon="💳" />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-xl font-bold">{editingEvent ? '✏️ Edit Event' : '➕ Create New Event'}</h2>
                <button onClick={() => { setShowEventModal(false); setEditingEvent(null); setFormData(emptyForm); }} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-xl">✕</button>
              </div>

              <form onSubmit={handleCreateEvent} className="p-6 space-y-5">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Music Concert Volunteer" required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter event description..." rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location *</label>
                      <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Location" required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                      <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      >
                        {['Technology', 'Entertainment', 'Sports', 'Social Service', 'Corporate', 'Food & Beverage', 'Events', 'Business', 'General'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date *</label>
                      <input type="date" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                      <input type="date" value={formData.eventEndDate} onChange={(e) => setFormData({...formData, eventEndDate: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time</label>
                      <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time</label>
                      <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pay Amount (₹)</label>
                      <input type="number" value={formData.pay.amount} onChange={(e) => setFormData({...formData, pay: {...formData.pay, amount: parseFloat(e.target.value) || 0}})} min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Applicants</label>
                      <input type="number" value={formData.maxApplicants} onChange={(e) => setFormData({...formData, maxApplicants: parseInt(e.target.value) || 50})} min="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Requirements (comma-separated)</label>
                    <input type="text" value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      placeholder="e.g. Good communication, Team player"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 accent-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">⭐ Mark as Featured Event</span>
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => { setShowEventModal(false); setEditingEvent(null); setFormData(emptyForm); }}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
