import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getCurrentUser } from './store/authSlice.js';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import BrowseEventsPage from './pages/BrowseEventsPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

// User Pages
import StudentDashboardPage from './pages/StudentDashboardPage.jsx';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage.jsx';
import PostEventPage from './pages/PostEventPage.jsx';
import EventPostingPaymentPage from './pages/EventPostingPaymentPage.jsx';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';

// Protected Route - requires general auth
const ProtectedRoute = ({ isAuthenticated, children, requiredRole = null }) => {
  const { user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Protected Route - checks adminToken in localStorage
const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  if (!adminToken || !adminUser) {
    return <AdminLogin />;
  }

  return children;
};

// Layout wrapper that shows or hides Navbar/Footer based on route
const MainLayout = ({ children, hideNav = false }) => (
  <div className="flex flex-col min-h-screen">
    {!hideNav && <Navbar />}
    <main className="flex-grow">{children}</main>
    {!hideNav && <Footer />}
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <Router>
      <Routes>
        {/* Admin Routes — no main Navbar/Footer */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Main App Routes */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/login"
                  element={
                    isAuthenticated
                      ? <Navigate to={`/dashboard/${user?.role || 'student'}`} replace />
                      : <LoginPage />
                  }
                />
                <Route
                  path="/signup"
                  element={
                    isAuthenticated
                      ? <Navigate to={`/dashboard/${user?.role || 'student'}`} replace />
                      : <SignupPage />
                  }
                />
                <Route path="/events" element={<BrowseEventsPage />} />
                <Route path="/events/:eventId" element={<EventDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Student Dashboard */}
                <Route
                  path="/dashboard/student"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="student">
                      <StudentDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Dashboard redirect based on role */}
                <Route
                  path="/dashboard"
                  element={
                    isAuthenticated
                      ? <Navigate to={`/dashboard/${user?.role || 'student'}`} replace />
                      : <Navigate to="/login" replace />
                  }
                />

                {/* Organizer Routes */}
                <Route
                  path="/dashboard/organizer"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="organizer">
                      <OrganizerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="organizer">
                      <OrganizerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/post-event"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="organizer">
                      <PostEventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/event-posting"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="organizer">
                      <EventPostingPaymentPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: { background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' },
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' },
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </Router>
  );
}

export default App;
