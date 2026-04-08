import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice.js';

const OrganizerDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    companyWebsite: user?.companyWebsite || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard', icon: '📊' },
    { id: 'events', label: '📋 My Events', icon: '🎯' },
    { id: 'applicants', label: '👥 Applicants', icon: '📝' },
    { id: 'payments', label: '💳 Payments', icon: '💰' },
    { id: 'profile', label: '⚙️ Profile', icon: '🏢' },
  ];

  const mockEvents = [
    {
      id: 1,
      title: 'Community Cleanup Drive',
      date: '2024-04-20',
      location: 'Ahmedabad',
      status: 'published',
      applicants: 25,
      paid: true,
    },
    {
      id: 2,
      title: 'Tree Planting Initiative',
      date: '2024-05-05',
      location: 'Gandhinagar',
      status: 'published',
      applicants: 18,
      paid: true,
    },
    {
      id: 3,
      title: 'Education Workshop for Underprivileged Kids',
      date: '2024-05-15',
      location: 'Surat',
      status: 'published',
      applicants: 32,
      paid: true,
    },
    {
      id: 4,
      title: 'Blood Donation Camp',
      date: '2024-06-01',
      location: 'Vadodara',
      status: 'published',
      applicants: 42,
      paid: true,
    },
    {
      id: 5,
      title: 'Senior Citizen Support Program',
      date: '2024-06-10',
      location: 'Rajkot',
      status: 'published',
      applicants: 15,
      paid: true,
    },
    {
      id: 6,
      title: 'Animal Welfare Awareness Event',
      date: '2024-06-20',
      location: 'Anand',
      status: 'published',
      applicants: 28,
      paid: false,
    },
    {
      id: 7,
      title: 'Women Empowerment Workshop',
      date: '2024-07-01',
      location: 'Bhavnagar',
      status: 'draft',
      applicants: 0,
      paid: false,
    },
    {
      id: 8,
      title: 'Tech Literacy for Rural Communities',
      date: '2024-07-15',
      location: 'Junagadh',
      status: 'published',
      applicants: 35,
      paid: true,
    },
  ];

  const mockApplicants = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      event: 'Community Cleanup Drive',
      status: 'pending',
      rating: 4.5,
    },
  ];

  const mockPayments = [
    {
      id: 1,
      event: 'Community Cleanup Drive',
      amount: 599,
      date: '2024-04-01',
      status: 'completed',
      plan: 'Featured Plan',
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
          className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-8 mb-8 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {user?.companyName || user?.firstName}! 👋
              </h1>
              <p className="text-green-100 text-lg">
                Email: {user?.email}
              </p>
              <p className="text-green-100 text-lg">
                Role: Event Organizer
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
              <p className="text-gray-600 text-sm">Total Events</p>
              <p className="text-3xl font-bold text-green-600">1</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-gray-600 text-sm">Active Events</p>
              <p className="text-3xl font-bold text-blue-600">1</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">👥</div>
              <p className="text-gray-600 text-sm">Total Applicants</p>
              <p className="text-3xl font-bold text-purple-600">25</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-gray-600 text-sm">Your Rating</p>
              <p className="text-3xl font-bold text-yellow-500">
                {user?.organizerRating || '—'}
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
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
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
                    <h3 className="text-lg font-semibold mb-4">💰 Revenue</h3>
                    <p className="text-3xl font-bold text-green-600 mb-2">₹599</p>
                    <p className="text-sm text-gray-500">From 1 event posting</p>
                  </div>
                  <div className="border rounded-lg p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-4">🎯 Quick Actions</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/organizer/post-event')}
                      className="block w-full mb-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-100"
                    >
                      Post New Event
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveTab('applicants')}
                      className="block w-full bg-green-50 text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-100"
                    >
                      View Applicants
                    </motion.button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">📈 Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <p className="text-gray-600 text-sm">Avg Applicants/Event</p>
                    <p className="text-3xl font-bold text-green-600">25</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <p className="text-gray-600 text-sm">Response Rate</p>
                    <p className="text-3xl font-bold text-blue-600">100%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <p className="text-gray-600 text-sm">Events This Month</p>
                    <p className="text-3xl font-bold text-purple-600">1</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Events</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/organizer/post-event')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  + Post New Event
                </motion.button>
              </div>

              {mockEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No events posted yet</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/organizer/post-event')}
                    className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Create Your First Event
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.01 }}
                      className="border rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.location}
                          </p>
                          <p className="text-gray-600 text-sm">
                            👥 {event.applicants} applicants
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm mb-3">
                            ✅ {event.status}
                          </span>
                          <div className="flex gap-2 justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="text-blue-600 font-semibold text-sm hover:text-blue-800"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="text-red-600 font-semibold text-sm hover:text-red-800"
                            >
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Applicants Tab */}
          {activeTab === 'applicants' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Applicants</h2>
              {mockApplicants.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No applicants yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockApplicants.map((applicant) => (
                    <motion.div
                      key={applicant.id}
                      whileHover={{ scale: 1.01 }}
                      className="border rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{applicant.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">📧 {applicant.email}</p>
                          <p className="text-gray-600 text-sm mb-2">
                            Event: {applicant.event}
                          </p>
                          <p className="text-gray-600 text-sm">
                            ⭐ Rating: {applicant.rating}/5
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold text-sm mb-3">
                            ⏳ {applicant.status}
                          </span>
                          <div className="flex gap-2 justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold"
                            >
                              Accept
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                            >
                              Reject
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment History</h2>
              {mockPayments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No payments yet</p>
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
                        <h3 className="text-lg font-bold mb-2">{payment.event}</h3>
                        <p className="text-gray-600 text-sm mb-1">
                          Plan: {payment.plan}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          ₹{payment.amount}
                        </p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✅ {payment.status}
                        </span>
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
                <h2 className="text-2xl font-bold">Company Profile</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setEditingProfile(!editingProfile)}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    editingProfile
                      ? 'bg-green-600 text-white'
                      : 'bg-green-600 text-white'
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
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={profileData.companyName}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    placeholder="Your company name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={profileData.companyWebsite}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    placeholder="https://yourcompany.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Company Description
                  </label>
                  <textarea
                    name="companyDescription"
                    value={profileData.companyDescription}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    placeholder="Tell us about your company"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75 h-24"
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
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
