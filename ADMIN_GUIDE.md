# Admin Panel Access Guide

## 🔐 How to Access the Admin Dashboard

### Option 1: Direct URL Access
Navigate directly to: **http://localhost:5173/admin/dashboard**

### Option 2: Admin Login
1. Go to the login page: http://localhost:5173/login
2. Use admin credentials with `role: 'admin'`
3. You'll automatically be redirected to the dashboard

---

## 👤 Default Admin Account (Demo Mode)

In demo mode, you can manually create an admin account or use this test account:

**Email:** admin@eventmates.com  
**Password:** Admin@123456  
**Role:** admin

> Note: In production with a real database, admin accounts should be created via a secure admin creation script.

---

## 📊 Admin Dashboard Features

### 1. **Overview Tab** 📊
- **Statistics**: View total users, events, pending verifications, and reports
- **Recent Users**: See newly registered users with their status
- **Recent Events**: Monitor event publications and approvals
- **Active Reports**: View reported users and their status

### 2. **User Management** 👥
- View all users (students, organizers, admins)
- Search and filter users by role and status
- **Actions**:
  - ✅ Verify user accounts
  - 🚫 Suspend users for violations
  - 📋 View user profiles and ratings

### 3. **Event Management** 📅
- List all events with their status
- **Actions**:
  - ✅ Approve pending events
  - 📋 View event details
  - 📊 See applicant counts

### 4. **Reports & Disputes** ⚠️
- View user reports and complaints
- **Status Options**:
  - Pending: New reports
  - Investigating: Under review
  - Resolved: Handled
- **Actions**:
  - Investigate reports
  - Suspend or ban users
  - Send warnings

### 5. **System Logs** 📝
- View all system activities
- Filter by type (user actions, payments, events, etc.)
- Real-time activity monitoring

---

## 🔌 API Endpoints Available to Admin

All admin routes require:
- Authentication token (JWT)
- `role: 'admin'` in the user profile

### Admin API Endpoints:

```
GET    /api/admin/dashboard/stats          - Get dashboard statistics
GET    /api/admin/users                     - List all users
PATCH  /api/admin/users/:userId/verify      - Verify/reject user
PATCH  /api/admin/users/:userId/suspend     - Suspend user account
GET    /api/admin/events                    - List all events
PATCH  /api/admin/events/:eventId/approve   - Approve/reject event
GET    /api/admin/reports                   - Get user reports
PATCH  /api/admin/reports/:reportId/status  - Update report status
GET    /api/admin/analytics/payments        - Payment analytics
GET    /api/admin/logs                      - System activity logs
```

---

## 🛡️ Admin Permissions & Capabilities

### User Management
- ✅ View all users and their details
- ✅ Verify student/organizer accounts
- ✅ Suspend or ban users
- ✅ View user ratings and reviews
- ✅ Manage user disputes

### Event Moderation
- ✅ Approve/reject events before publishing
- ✅ Monitor event safety and compliance
- ✅ View event applications and volunteers
- ✅ Manage fraudulent event reports

### Financial Management
- ✅ View payment statistics
- ✅ Monitor transaction history
- ✅ Identify payment fraud
- ✅ Process refunds

### System Administration
- ✅ View system activity logs
- ✅ Monitor platform health
- ✅ Generate analytics reports
- ✅ Manage platform settings

---

## 🚀 Setting Up Admin Access (Production)

### Step 1: Create Admin User Script
```javascript
// scripts/createAdmin.js
import User from './src/models/User.js';
import bcrypt from 'bcryptjs';

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('SecureAdminPassword123', 10);
  
  const admin = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@eventmates.com',
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
  });
  
  await admin.save();
  console.log('Admin user created successfully');
};

createAdmin();
```

### Step 2: Run the Script
```bash
npm run create-admin
```

### Step 3: Login with Admin Credentials
- Go to /login
- Enter admin email and password
- You'll be redirected to /admin/dashboard

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Protected API endpoints (admin-only)
- ✅ Activity logging for all admin actions
- ✅ IP whitelisting (can be added)
- ✅ Rate limiting on login attempts

---

## 📊 Demo Data Available

The admin dashboard comes pre-populated with demo data:

### Users (Demo)
- 1,250 total users
- 45 organizers
- 1,205 students
- 28 pending verifications

### Events (Demo)
- 380 total events
- 92 active events
- 288 completed events

### Financial (Demo)
- $250,000 total revenue
- 1,250 transactions processed
- 2.5% refund rate

---

## ⚙️ Configuration

### Admin Settings (Optional)
Edit `.env` to configure:

```env
# Admin configuration
ADMIN_EMAIL_NOTIFICATIONS=true
ADMIN_LOG_RETENTION_DAYS=90
MAX_ADMIN_SESSIONS=5
ADMIN_TIMEOUT_MINUTES=30
```

---

## 🆘 Troubleshooting

### Issue: Can't access admin panel
**Solution**: 
- Verify your user role is set to `'admin'`
- Check JWT token is valid
- Clear browser cache and login again

### Issue: Admin routes returning 403 Forbidden
**Solution**:
- Ensure you're authenticated
- Verify your token includes `role: 'admin'`
- Check middleware authorization logic

### Issue: Demo data not loading
**Solution**:
- Hard refresh the page (Cmd+Shift+R on Mac)
- Clear localStorage: `localStorage.clear()`
- Restart the frontend server

---

## 📚 Related Documentation

- [Admin API Reference](../API_TESTING.md#admin-endpoints)
- [Security Best Practices](../DEPLOYMENT.md#security)
- [User Roles & Permissions](../README.md#role-based-access)
- [Database Models](../README.md#database-schema)

---

## 🎯 Next Steps

1. **Access the admin dashboard** at http://localhost:5173/admin/dashboard
2. **Explore the interface** - Check all tabs and features
3. **Review admin actions** - Approve/reject users and events
4. **Monitor reports** - Handle user complaints
5. **Check system logs** - Review platform activity

---

**Admin Dashboard Version:** 1.0.0  
**Last Updated:** April 7, 2026

Happy moderation! 🚀
