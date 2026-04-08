#!/bin/bash

# ============================================
# EVENTMATES ADMIN PANEL - QUICK START GUIDE
# ============================================

echo "
╔════════════════════════════════════════════════════════════════╗
║          🏢 ENTERPRISE ADMIN PANEL - QUICK START 🏢            ║
║                                                                ║
║              EventMates Admin Management System                ║
╚════════════════════════════════════════════════════════════════╝
"

echo "📋 SETUP CHECKLIST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "
✅ STEP 1: Start Backend Server
   Command: cd /Users/dhyey/Desktop/EventMates/server && npm run dev
   Port: 5001
   Status: Should show '🚀 EventMates Server is Running'
"

echo "✅ STEP 2: Start Frontend Server
   Command: cd /Users/dhyey/Desktop/EventMates/client && npm run dev
   Port: 5173
   Status: Ready for browser
"

echo "✅ STEP 3: Access Admin Panel
   URL: http://localhost:5173/admin/login
   Or directly: http://localhost:5173/admin/dashboard
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 DEFAULT ADMIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email:    admin@eventmates.com
Password: Admin@123456

⚠️  CHANGE THESE CREDENTIALS IN PRODUCTION!
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ADMIN PANEL FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 DASHBOARD
   ├─ Platform Statistics (Users, Events, Revenue)
   ├─ Real-time Analytics Charts
   ├─ Pending Actions Summary
   └─ Recent Activity Feed

📅 EVENT MANAGEMENT
   ├─ ➕ Create new events
   ├─ ✏️  Edit existing events
   ├─ ❌ Delete events
   ├─ 🔍 Filter by status/location/category
   └─ 👁️  View event details & applicants

👥 VOLUNTEER MANAGEMENT
   ├─ View all registered volunteers
   ├─ ✅ Verify/unverify accounts
   ├─ 🚫 Remove volunteers
   ├─ ⭐ Check ratings & reviews
   └─ 📊 View volunteer performance

👨‍💼 USER MANAGEMENT
   ├─ List all users (Students & Organizers)
   ├─ 🔐 Reset passwords
   ├─ 🚫 Block/suspend accounts
   ├─ 🔍 Filter by role & status
   └─ 📋 View user profiles

💳 PAYMENT CONTROL
   ├─ 💰 View all transactions
   ├─ 📊 Revenue analytics
   ├─ 🔄 Process refunds
   ├─ 📈 Monthly breakdown
   └─ 📥 Export transaction reports

📢 NOTIFICATIONS
   ├─ 📨 Send broadcast messages
   ├─ 👥 Target: All users / Volunteers / Organizers
   ├─ 📱 Push notifications
   └─ 📊 Track delivery & reads

⚙️  SYSTEM SETTINGS
   ├─ Platform configuration
   ├─ Email settings
   ├─ Maintenance mode toggle
   ├─ Verification requirements
   └─ Performance settings

📝 ACTIVITY LOGS
   ├─ 📋 Complete audit trail
   ├─ 🔍 Filter by action type
   ├─ 📅 Filter by date range
   ├─ 👤 Track by admin
   └─ 📥 Export logs as CSV
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔌 API ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUTHENTICATION
  POST   /api/admin/login

DASHBOARD
  GET    /api/admin/dashboard/stats

EVENTS
  GET    /api/admin/events
  POST   /api/admin/events/create
  PATCH  /api/admin/events/:eventId/update
  DELETE /api/admin/events/:eventId/delete

VOLUNTEERS
  GET    /api/admin/volunteers
  PATCH  /api/admin/volunteers/:id/verify
  DELETE /api/admin/volunteers/:id/remove

USERS
  GET    /api/admin/users
  PATCH  /api/admin/users/:userId/block
  PATCH  /api/admin/users/:userId/reset-password

PAYMENTS
  GET    /api/admin/payments
  POST   /api/admin/payments/:id/refund

BROADCAST
  POST   /api/admin/broadcast

LOGS
  GET    /api/admin/logs

SETTINGS
  GET    /api/admin/settings
  PATCH  /api/admin/settings/update
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗂️  FILE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKEND
/server/src/
├── controllers/adminController.js        (500+ lines, 18 functions)
├── routes/adminRoutes.js                 (60+ lines, 22 endpoints)
├── middlewares/auth.js                   (JWT verification)
├── models/User.js                        (with admin role)
└── models/Event.js                       (event management)

FRONTEND
/client/src/pages/
├── AdminLogin.jsx                        (Secure login page)
└── AdminDashboard.jsx                    (Main dashboard)

DOCUMENTATION
├── ENTERPRISE_ADMIN_GUIDE.md             (This guide)
└── ADMIN_GUIDE.md                        (Additional docs)
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 WORKFLOW EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TO CREATE AN EVENT:
   1. Login with admin credentials
   2. Click 'Create Event' tab
   3. Fill form (title, location, dates, payment)
   4. Submit form
   5. Event auto-published on main site ✅

🔍 TO VERIFY A VOLUNTEER:
   1. Go to 'Volunteers' tab
   2. Search for volunteer
   3. Click 'Verify' button
   4. Confirm action
   5. Volunteer verified ✅

🚫 TO BLOCK A USER:
   1. Go to 'Users' tab
   2. Find suspicious user
   3. Click 'Block' button
   4. Enter reason
   5. User blocked from platform ✅

💰 TO PROCESS REFUND:
   1. Go to 'Payments' tab
   2. Find transaction
   3. Click 'Refund'
   4. Enter reason
   5. Refund processed ✅

📢 TO SEND BROADCAST:
   1. Go to 'Settings' tab
   2. Click 'Send Broadcast'
   3. Select target (All/Volunteers/Organizers)
   4. Write message
   5. Send to platform ✅
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 SECURITY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Separate admin login route
✅ JWT token authentication
✅ Role-based access control (RBAC)
✅ Password hashing (bcrypt)
✅ Complete audit trail
✅ IP address tracking
✅ Admin account verification
✅ Activity logging
✅ Rate limiting
✅ CORS protection
✅ Input validation
✅ Error handling
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PERFORMANCE TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Use pagination for large datasets
• Filter before searching
• Enable caching for stats
• Use bulk actions for multiple items
• Monitor activity logs regularly
• Archive old logs periodically
• Backup database daily
• Monitor API performance
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Can't login?
   → Check email/password
   → Verify admin role in database
   → Ensure account is active

❓ Protected routes showing 403?
   → Token may be expired
   → Try logging in again
   → Check browser localStorage

❓ API returns 500?
   → Check server logs
   → Verify MongoDB connection
   → Check .env variables

❓ Activity logs not showing?
   → Enable logging in controller
   → Check database permissions
   → Verify admin user role
"

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 DOCUMENTATION LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Full Guide:     ENTERPRISE_ADMIN_GUIDE.md
📄 Quick Ref:      ADMIN_GUIDE.md
📄 API Reference:  See ENTERPRISE_ADMIN_GUIDE.md (#api-endpoints)
📄 Database:       See ENTERPRISE_ADMIN_GUIDE.md (#database-models)
"

echo "
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ✨ Admin Panel Ready! Visit http://localhost:5173/admin/login
║                                                                ║
║              Happy Admin Management! 🚀                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
"
