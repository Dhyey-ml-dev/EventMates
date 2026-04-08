# 🔐 Authentication System - Complete Testing & Troubleshooting Guide

## 📋 Status Check

**Current System:** Node.js/Express + MongoDB + JWT
**Status:** ✅ Code is syntactically correct, no compilation errors

---

## 🚀 Quick Start to Test Auth

### Step 1: Start Backend Server

```bash
cd /Users/dhyey/Desktop/EventMates/server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected
✅ Server running on http://localhost:5001
```

### Step 2: Start Frontend

```bash
cd /Users/dhyey/Desktop/EventMates/client
npm run dev
```

**Expected Output:**
```
✅ Vite running on http://localhost:5173
```

### Step 3: Test Signup

1. Go to `http://localhost:5173/signup`
2. Fill in:
   - **Email:** test@example.com
   - **Password:** Password123
   - **First Name:** John
   - **Last Name:** Doe
   - **Role:** Student
3. Click "Sign Up"

**Expected:**
- ✅ Account created
- ✅ Redirected to dashboard
- ✅ Token saved in localStorage

### Step 4: Test Login

1. Go to `http://localhost:5173/login`
2. Fill in:
   - **Email:** test@example.com
   - **Password:** Password123
3. Click "Login"

**Expected:**
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ Navbar shows user info

---

## 🔧 Common Issues & Solutions

### Issue 1: "Email already registered" but account doesn't exist

**Cause:** Duplicate user in database

**Fix:**
```bash
# Access MongoDB directly
mongosh
use eventmates_db
db.users.deleteMany({ email: "test@example.com" })
exit
```

---

### Issue 2: "Invalid email or password" on login

**Cause:** Wrong credentials or password not hashed

**Fix:**
1. Delete account and signup again
2. Make sure you're using the same email/password

---

### Issue 3: Blank/Invalid Token Error

**Cause:** JWT secret not configured

**Fix:** Check `.env` file has:
```
JWT_SECRET=your_super_secret_key_12345
JWT_REFRESH_SECRET=your_refresh_secret_key_12345
```

---

### Issue 4: CORS Error ("Access-Control-Allow-Origin")

**Cause:** Frontend and backend not connected

**Fix:** 
1. Check `VITE_API_URL` in frontend `.env`:
   ```
   VITE_API_URL=http://localhost:5001/api
   ```

2. Check backend `.env`:
   ```
   FRONTEND_URL=http://localhost:5173
   ```

---

## 🧪 Manual Testing Steps

### Test 1: Signup Flow

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { ...user data },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### Test 2: Login Flow

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

---

### Test 3: Get Current User

```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Database Check

### View All Users

```bash
mongosh
use eventmates_db
db.users.find().pretty()
```

### Delete Test User

```bash
db.users.deleteOne({ email: "test@example.com" })
```

---

## 🚨 Error Messages Explained

| Error | Cause | Solution |
|-------|-------|----------|
| `Email already registered` | User exists | Delete user from DB or use different email |
| `Invalid email or password` | Wrong credentials | Verify email/password combination |
| `Refresh token is required` | No refresh token | Re-login to get new tokens |
| `Password must be at least 6 characters` | Weak password | Use stronger password |
| `First name must be at least 2 characters` | Name too short | Use longer name |

---

## 🔄 Authentication Flow (Visual)

```
1. User fills signup form
   ↓
2. Frontend sends POST /auth/signup
   ↓
3. Backend validates & creates user
   ↓
4. Backend generates JWT tokens
   ↓
5. Frontend saves tokens to localStorage
   ↓
6. User redirected to dashboard
   ↓
7. Navbar shows user info
```

---

## ✅ Verification Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads without errors
- [ ] Can navigate to /signup page
- [ ] Can navigate to /login page
- [ ] Signup with valid data succeeds
- [ ] Login with valid credentials succeeds
- [ ] Tokens saved in localStorage
- [ ] Navbar shows authenticated user
- [ ] Can access protected routes (/dashboard)
- [ ] Logout clears tokens

---

## 🌐 Tech Stack

**Frontend:**
- React 18
- Redux Toolkit (Auth State)
- Axios (API Calls)
- Tailwind CSS
- Framer Motion (Animations)

**Backend:**
- Node.js/Express
- MongoDB
- JWT (Authentication)
- Zod (Validation)
- Bcrypt (Password Hashing)

---

## 📱 Demo Credentials (After Signup)

```
Email: demo@eventmates.com
Password: Demo@123456
Role: Student
```

---

## 🆘 Still Having Issues?

1. **Check Server Logs:**
   ```bash
   # Terminal 1
   cd /Users/dhyey/Desktop/EventMates/server && npm run dev
   # Look for errors
   ```

2. **Check Frontend Console:**
   - Open Browser DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Check Network tab for API calls

3. **Check Database:**
   ```bash
   mongosh
   use eventmates_db
   db.users.find()
   ```

4. **Clear Cache & Restart:**
   ```bash
   # Clear browser cache
   # Kill both servers: Ctrl+C
   # Start fresh:
   cd server && npm run dev
   # In another terminal:
   cd client && npm run dev
   ```

---

## 🚀 Next Steps

Once auth is working:

1. ✅ Create sample events in database
2. ✅ Browse events on /events page
3. ✅ Apply for events as student
4. ✅ Post events as organizer (with payment)
5. ✅ Admin dashboard for event management

---

## 💡 Tips

- **Keep Backend Terminal Open:** You need to see any errors
- **Use Incognito Mode:** Avoids cache issues
- **Check Network Tab:** See actual API requests/responses
- **Test with Postman:** Before testing in UI

---

## 🎯 Performance Notes

**Current Stack (Node.js):**
- ✅ Good for rapid development
- ✅ Easy JavaScript integration
- ✅ Large community support
- ⚠️ Single-threaded (can be bottleneck at scale)

**Alternative: Django (Python)**
- ✅ Better async performance (with async/await)
- ✅ Built-in ORM (Django ORM)
- ✅ Built-in admin panel
- ✅ More secure by default
- ⚠️ Requires backend rewrite

---

### Would you like to:
1. **Test current auth system** - Follow Quick Start steps above
2. **Migrate to Django** - I'll help rewrite entire backend
3. **Optimize Node.js** - Add caching, async improvements

---
