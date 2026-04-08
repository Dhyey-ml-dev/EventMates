import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice.js';
import { getDefaultImage } from '../utils/imageUtils.js';

const StudentDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    college: user?.college || '',
    phoneNumber: user?.phoneNumber || '',
    skills: user?.skills?.join(', ') || '',
  });

  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard', icon: '📊' },
    { id: 'applications', label: '📋 My Applications', icon: '📝' },
    { id: 'profile', label: '👤 Profile', icon: '⚙️' },
    { id: 'ratings', label: '⭐ Ratings', icon: '🏆' },
    { id: 'payments', label: '💳 Payments', icon: '💰' },
  ];

  const mockApplications = [
    {
      id: 1,
      eventTitle: 'Community Cleanup Drive',
      eventDate: '2024-04-20',
      status: 'accepted',
      applicantCount: 25,
    },
    {
      id: 2,
      eventTitle: 'Tech Workshop',
      eventDate: '2024-05-10',
      status: 'pending',
      applicantCount: 12,
    },
  ];

  const mockPayments = [
    {
      id: 1,
      event: 'Community Cleanup Drive',
      amount: 0,
      date: '2024-04-20',
      status: 'completed',
    },
  ];

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login', { replace: true });
    toast.success('Logged out successfully');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {user?.firstName} {user?.lastName}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Email: {user?.email}
              </p>
              <p className="text-blue-100 text-lg">
                College: {user?.college || 'Not specified'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-gray-600 text-sm">Applications Sent</p>
              <p className="text-3xl font-bold text-blue-600">2</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-gray-600 text-sm">Accepted</p>
              <p className="text-3xl font-bold text-green-600">1</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">1</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-gray-600 text-sm">Your Rating</p>
              <p className="text-3xl font-bold text-yellow-500">
                {user?.studentRating || '—'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">📊 Your Activity Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-4">🔥 Upcoming Opportunity</h3>
                    <p className="text-gray-700 mb-2">Tech Workshop</p>
                    <p className="text-sm text-gray-500">May 10, 2024</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      View Event
                    </motion.button>
                  </div>
                  <div className="border rounded-lg p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-4">🎯 Quick Actions</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/events')}
                      className="block w-full mb-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100"
                    >
                      Browse Events
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveTab('profile')}
                      className="block w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100"
                    >
                      Complete Profile
                    </motion.button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">📈 Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <p className="text-gray-600 text-sm">Volunteer Hours</p>
                    <p className="text-3xl font-bold text-blue-600">24</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <p className="text-gray-600 text-sm">Events Attended</p>
                    <p className="text-3xl font-bold text-green-600">1</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <p className="text-gray-600 text-sm">Badges Earned</p>
                    <p className="text-3xl font-bold text-purple-600">2</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Event Applications</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/events')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  + Browse Events
                </motion.button>
              </div>

              {mockApplications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No applications yet</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/events')}
                    className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Explore Events
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockApplications.map((app) => (
                    <motion.div
                      key={app.id}
                      whileHover={{ scale: 1.01 }}
                      className="border rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{app.eventTitle}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            📅 {new Date(app.eventDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 text-sm">
                            👥 {app.applicantCount} total applicants
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                              app.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {app.status === 'accepted' ? '✅ Accepted' : '⏳ Pending'}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="block mt-3 text-blue-600 font-semibold text-sm hover:text-blue-800"
                          >
                            View Details →
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setEditingProfile(!editingProfile)}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    editingProfile
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {editingProfile ? '✅ Done' : '✏️ Edit'}
                </motion.button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={!editingProfile}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={!editingProfile}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    College
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={profileData.college}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    placeholder="Your college name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Skills (comma-separated)
                  </label>
                  <textarea
                    name="skills"
                    value={profileData.skills}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    placeholder="e.g., Event Planning, Marketing, Photography"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75 h-24"
                  />
                </div>

                {editingProfile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleSaveProfile}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Save Changes
                  </motion.button>
                )}
              </div>
            </div>
          )}

          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Ratings & Reviews</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <p className="text-3xl font-bold text-yellow-500 mb-2">
                  {user?.studentRating || 'Not yet rated'}
                </p>
                <p className="text-gray-600 text-lg">
                  Based on {user?.studentReviewCount || 0} reviews
                </p>
                <div className="mt-8 bg-blue-50 rounded-lg p-6 text-left max-w-2xl mx-auto">
                  <p className="text-gray-700 mb-4">
                    Your rating is calculated based on feedback from event organizers.
                    Complete events with excellence to improve your rating!
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>✅ Attend events on time</li>
                    <li>✅ Complete assigned tasks professionally</li>
                    <li>✅ Communicate effectively with organizers</li>
                    <li>✅ Maintain high professionalism</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment History</h2>
              {mockPayments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockPayments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      whileHover={{ scale: 1.01 }}
                      className="border rounded-lg p-6 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-lg font-bold">{payment.event}</h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ₹{payment.amount}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✅ {payment.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
