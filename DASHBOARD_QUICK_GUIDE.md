# User Dashboard - Quick Reference Guide

## 🚀 Quick Start

### Login or Signup
1. Open browser: `http://localhost:5173`
2. Click "Login" or "Sign Up"
3. Fill in credentials
4. **Automatically redirected to your dashboard!**

---

## 🎯 Dashboard URLs

### After Login:
- **Student:** `http://localhost:5173/dashboard/student`
- **Organizer:** `http://localhost:5173/dashboard/organizer`

---

## 📊 Student Dashboard Features

| Tab | What You Can Do |
|-----|-----------------|
| **Dashboard** 🏠 | See activity overview, statistics, quick actions |
| **Applications** 📋 | View all event applications, check status |
| **Profile** 👤 | Edit name, college, skills, contact info |
| **Ratings** ⭐ | View your rating and review count |
| **Payments** 💳 | Check payment history for events |

### Quick Actions
- 📌 Browse Events (from dashboard)
- 📌 Complete Profile (from dashboard)
- 📌 Logout (top-right button)

---

## 💼 Organizer Dashboard Features

| Tab | What You Can Do |
|-----|-----------------|
| **Dashboard** 🏠 | See activity overview, revenue, quick actions |
| **Events** 📋 | Create, edit, delete events |
| **Applicants** 👥 | View applicants, accept/reject applications |
| **Payments** 💳 | Check payment history for event postings |
| **Profile** ⚙️ | Edit company info, description, website |

### Quick Actions
- 📌 Post New Event (from dashboard or Events tab)
- 📌 View Applicants (from dashboard)
- 📌 Logout (top-right button)

---

## 🔧 Profile Editing

### For Both Roles:
1. Go to "Profile" tab
2. Click "✏️ Edit" button
3. Modify fields (email is read-only)
4. Click "✅ Done" button
5. Information is saved

---

## 🚪 Logout

**From Any Dashboard:**
1. Look for "Logout" button in top-right corner
2. Click it
3. Confirm action
4. Automatically redirected to login page

---

## 📋 What's in Mock Data?

### Student Dashboard Shows:
- 2 sample applications (1 accepted, 1 pending)
- 24 volunteer hours
- 2 badges earned
- 1 pending event application

### Organizer Dashboard Shows:
- 1 posted event (Community Cleanup Drive)
- 25 total applicants
- ₹599 revenue
- Sample applicants list

---

## 🎨 Dashboard Sections

### Header
- Welcome message with your name/company
- User info (email, college/company)
- Logout button

### Stats (Dashboard Tab Only)
- 4 cards showing key metrics
- Different colors for visual appeal
- Quick overview of activity

### Tabs
- Click any tab to switch views
- Active tab is highlighted
- All content loads instantly

### Content Area
- Tab-specific content
- Edit buttons where applicable
- Action buttons (save, delete, etc.)

---

## ✨ Features Available Now

✅ View individual dashboard by role
✅ Switch between tabs
✅ Edit profile information
✅ View statistics and metrics
✅ Logout from dashboard
✅ Mock data for demonstration
✅ Responsive mobile design
✅ Smooth animations

---

## 🔄 Features Coming Soon (Backend Integration)

- Real event management
- Real applicant tracking
- Real payment processing
- Real user data from database
- Email notifications
- Real-time updates

---

## 🆘 Troubleshooting

### Dashboard Not Showing After Login
**Solution:**
1. Check browser console (F12) for errors
2. Verify URL is correct: `/dashboard/student` or `/dashboard/organizer`
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Refresh page: `Ctrl+R`

### Profile Won't Edit
**Solution:**
1. Click "✏️ Edit" button first
2. Modify fields
3. Click "✅ Done" button
4. You should see success toast

### Logout Not Working
**Solution:**
1. Check if logout button is visible (top-right)
2. Ensure you're logged in (tokens in localStorage)
3. Check browser console for errors
4. Try manual logout: Open DevTools, clear localStorage

### Wrong Dashboard Showing
**Solution:**
1. Logout and login again
2. Check user role during signup
3. Verify Redux state in DevTools
4. Ensure correct email/role created

---

## 🎯 Common Tasks

### View My Events (Organizer)
1. Go to dashboard
2. Click "Events" tab
3. Click "View Details" on any event

### Check Applications (Student)
1. Go to dashboard
2. Click "Applications" tab
3. View status of each application

### Update Company Info (Organizer)
1. Go to dashboard
2. Click "Profile" tab
3. Click "✏️ Edit"
4. Modify company details
5. Click "✅ Done"

### View Payment History (Both)
1. Go to dashboard
2. Click "Payments" tab
3. See all payment transactions

---

## 📱 Mobile Friendly

All dashboards work perfectly on:
- 📱 Phones (300px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

Features adapt automatically based on screen size.

---

## 🔐 Security Notes

- ✅ Only logged-in users can access dashboards
- ✅ Routes are protected with authentication
- ✅ Tokens are securely stored
- ✅ Logout clears all session data
- ✅ Different views based on user role

---

## 📞 Need Help?

### Check These Files:
- `USER_DASHBOARD_GUIDE.md` - Full documentation
- `LOGIN_LOGOUT_GUIDE.md` - Auth flow help
- `QUICK_START.md` - Quick setup guide

### Browser DevTools (F12)
- Console: Check for error messages
- Network: Check API calls
- Application: View stored tokens
- Redux: Check auth state

---

## 🎓 Learning Points

### What You Can Do Now:
1. ✅ Login as student or organizer
2. ✅ View personalized dashboard
3. ✅ Edit your profile
4. ✅ See your statistics
5. ✅ Manage applications/events
6. ✅ View payment history
7. ✅ Logout securely

### What's Connected to Backend:
1. ✅ Login/signup authentication
2. ✅ User data from database
3. ✅ Token-based security
4. ✅ Redux state management

### What's Using Mock Data (for now):
1. 📊 Event listings and details
2. 📋 Applications and applicants
3. 💳 Payment history
4. 📈 Statistics and metrics

---

## 🎉 You're All Set!

Your EventMates platform now has **fully functional user dashboards** tailored to each role. Users are automatically directed to the right dashboard after login.

**Start exploring!**
1. Open http://localhost:5173
2. Signup or login
3. Enjoy your personalized dashboard!

---

**Last Updated:** April 8, 2026
**Status:** ✅ Ready to Use
