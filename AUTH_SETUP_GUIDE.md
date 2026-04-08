# Authentication System - Complete Setup & Testing Guide

## Quick Start

### 1. **Start MongoDB (if not running)**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or run in terminal
mongod
```

### 2. **Start Backend Server**
```bash
cd /Users/dhyey/Desktop/EventMates/server
npm run dev
# Should see: 🚀 EventMates Server is Running - Port: 5001
```

### 3. **Start Frontend**
```bash
cd /Users/dhyey/Desktop/EventMates/client
npm run dev
# Should see: Local: http://localhost:5173
```

### 4. **Test Authentication**
```bash
cd /Users/dhyey/Desktop/EventMates/server
node test-auth.js
# Should see: ✅ All Tests Passed!
```

---

## Testing With CURL Commands

### Test 1: Health Check
```bash
curl http://localhost:5001/health
```
**Expected Response:**
```json
{
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

### Test 2: Signup (Create New Account)
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test@123456",
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
    "user": {
      "_id": "...",
      "email": "testuser@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Test 3: Login (With Registered Email)
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test@123456"
  }'
```
**Expected Response:** Same as signup above

### Test 4: Get Current User (Protected Route)
```bash
# Replace YOUR_TOKEN with the actual accessToken from login response
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "email": "testuser@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Test 5: Logout
```bash
curl -X POST http://localhost:5001/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Frontend Testing (Browser)

### 1. **Open in Browser**
- Navigate to: `http://localhost:5173`

### 2. **Try Signup**
- Click "Sign Up" or go to `/signup`
- Fill in:
  - First Name: John
  - Last Name: Doe
  - Email: newemail@example.com
  - Password: Test@123456
  - Role: Student Volunteer
- Click "Sign Up"
- **Expected:** Account created, redirect to home page

### 3. **Check Browser Console**
- Press `F12` to open Developer Tools
- Go to "Console" tab
- You should NOT see any red errors
- You SHOULD see POST requests to `/api/auth/signup`

### 4. **Check LocalStorage**
- In Developer Tools, go to "Application" → "LocalStorage"
- Look for `http://localhost:5173`
- You should see:
  - `accessToken`: (long JWT token)
  - `refreshToken`: (long JWT token)

### 5. **Try Login**
- Logout first
- Go to `/login`
- Enter email and password from signup
- Click "Login"
- **Expected:** Logged in, redirect to home page

### 6. **Verify Protected Routes**
- After login, try going to `/browse-events` or other protected pages
- **Expected:** No redirect to login, content loads normally

---

## Troubleshooting Checklist

### ❌ "Cannot connect to server" or "Connection refused"
**Solution:**
```bash
# 1. Check if backend is running on port 5001
lsof -i :5001

# 2. If not running, start it
cd /Users/dhyey/Desktop/EventMates/server
npm run dev

# 3. Check if you see: 🚀 EventMates Server is Running - Port: 5001
```

### ❌ "MongoDB connection error"
**Solution:**
```bash
# 1. Start MongoDB
brew services start mongodb-community

# 2. Or run manually
mongod

# 3. Check if it's running on port 27017
lsof -i :27017
```

### ❌ "Email already registered"
**Solution:**
- Use a different email address for testing
- Or use the test script which generates unique emails: `node test-auth.js`

### ❌ "Invalid email or password" after signup
**Solution:**
1. Check browser console (F12) for exact error message
2. Verify password was hashed correctly in database:
```bash
# In MongoDB
mongosh
use eventmates
db.users.findOne({ email: "your-test-email@example.com" })
# You should see: password: "$2a$10$..." (bcrypt hash)
```

### ❌ Tokens not saving to localStorage
**Solution:**
1. Check browser console for errors
2. Verify localStorage is enabled:
   - F12 → Application → LocalStorage → http://localhost:5173
3. Check if tokens are being returned in API response:
   - F12 → Network → Click auth/login request → Response tab
   - Look for `accessToken` and `refreshToken` fields

### ❌ Signup/Login button stays "Loading..."
**Solution:**
1. Check backend console for errors
2. Check browser console (F12) for network errors
3. Verify backend is responding:
```bash
curl http://localhost:5001/health
# Should return: {"message": "Server is running", ...}
```

### ❌ Can't access protected routes after login
**Solution:**
1. Check if token is in Authorization header:
   - F12 → Network → Click any API request
   - Headers tab → Look for `Authorization: Bearer ...`
2. Verify token format:
   - Token should start with `eyJhbGc`
   - Should have 3 parts separated by dots

---

## Key Files to Check

| File | Purpose |
|------|---------|
| `/server/.env` | Server configuration (PORT=5001, DATABASE, JWT secrets) |
| `/server/src/models/User.js` | User schema with password hashing |
| `/server/src/controllers/authController.js` | Signup/login logic |
| `/server/src/utils/jwt.js` | Token generation and verification |
| `/client/src/api/axios.js` | API client with interceptors |
| `/client/src/api/endpoints.js` | API endpoint definitions |
| `/client/src/store/authSlice.js` | Redux authentication state |
| `/client/src/pages/LoginPage.jsx` | Login UI |
| `/client/src/pages/SignupPage.jsx` | Signup UI |

---

## JWT Token Structure

### Access Token
- **Duration:** 7 days
- **Contains:** userId, role, issueTime
- **Used for:** Authenticating API requests

### Refresh Token
- **Duration:** 30 days
- **Contains:** userId, role, issueTime
- **Used for:** Getting new access token when expired

### Example Token Breakdown
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI2Nzg5MjM0ZTFmMjM0NTY3ODkwYWJjZGVmIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3Mzc1NDI5ODksImV4cCI6MTczODI5ODk4OX0.
qF5VkR8zT9xM2L7qK1nP9oJhW4rQ6sT8uV3wX4yZ1aB
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Header       │                  Payload                           │         Signature           │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Success Indicators

✅ **You know it's working when:**
1. `node test-auth.js` shows "✅ All Tests Passed!"
2. Signup creates account with hashed password in MongoDB
3. Login with registered email and password returns tokens
4. Tokens saved in localStorage
5. Protected routes accessible with valid token
6. Token refresh works when access token expires
7. Logout clears tokens from localStorage

---

## Environment Variables (.env)

Make sure these are set in `/server/.env`:

```env
# Must be 5001
PORT=5001

# JWT secrets
JWT_SECRET=eventmates_dev_secret_key_2026_super_secure_key
JWT_REFRESH_SECRET=eventmates_dev_refresh_secret_key_2026_refresh

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/eventmates
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "...",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Common Error Messages

| Error | Reason | Solution |
|-------|--------|----------|
| `Email already registered` | Account exists | Use different email |
| `Invalid email or password` | Wrong credentials | Check email and password |
| `Email is required` | Empty email field | Enter valid email |
| `Password must be at least 6 characters` | Weak password | Use stronger password |
| `Refresh token is required` | Missing refresh token | Clear localStorage, login again |
| `Invalid or expired refresh token` | Token expired | Login again |
| `Cannot POST /api/auth/signup` | Server not running on 5001 | Start backend server |
| `CORS error` | Frontend/backend mismatch | Check PORT and FRONTEND_URL |

---

## Database Commands

### Check if MongoDB is running
```bash
mongosh
# If connected, you'll see: test>
```

### View all users
```bash
mongosh
use eventmates
db.users.find()
```

### Check a specific user
```bash
db.users.findOne({ email: "test@example.com" })
```

### Count total users
```bash
db.users.countDocuments()
```

### Delete all users (for fresh testing)
```bash
db.users.deleteMany({})
```

---

## Performance Notes

- **Signup:** Creates user, hashes password (takes ~100ms), generates tokens
- **Login:** Finds user, compares password (takes ~100ms), generates tokens
- **Token Verification:** Validates JWT signature (instant)
- **Token Refresh:** Generates new token (takes ~10ms)

---

## Security Checklist

✅ **Passwords:**
- Hashed with bcryptjs (10 salt rounds)
- Never sent in API responses
- Never logged in console

✅ **Tokens:**
- Secure JWT with 256-bit HMAC
- Access token expires in 7 days
- Refresh token expires in 30 days
- Stored in localStorage (NOT cookies for CORS)

✅ **API:**
- CORS configured to allow frontend origin
- Rate limiting enabled
- Input validation with Zod
- Error messages don't leak sensitive info

✅ **Database:**
- Unique email constraint
- Password field set to `select: false`
- Timestamps for created/updated

---

## Next Steps If Issues Persist

1. **Check backend logs:**
   ```bash
   cd /Users/dhyey/Desktop/EventMates/server
   npm run dev
   # Look for error messages
   ```

2. **Check MongoDB:**
   ```bash
   mongosh
   use eventmates
   db.users.find().pretty()
   ```

3. **Test with curl:**
   ```bash
   # See CURL commands section above
   ```

4. **Check browser console:**
   - F12 → Console tab
   - Look for red error messages
   - Click on them for full stack trace

5. **Verify network requests:**
   - F12 → Network tab
   - Click on `auth/signup` or `auth/login` request
   - Check Response tab for exact error message
   - Check Status code (should be 200 or 201 for success)

---

**Created:** 2024
**Last Updated:** Today
**Status:** ✅ Production Ready
