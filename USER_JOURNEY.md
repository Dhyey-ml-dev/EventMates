# Complete User Journey - From Login to Dashboard

## 🎯 The User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    START HERE                               │
│              http://localhost:5173                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   Home Page / Navbar   │
        │  (See Login/Signup)    │
        └────────┬───────────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ┌────────────┐  ┌──────────────┐
    │   LOGIN    │  │    SIGNUP    │
    └────┬───────┘  └──────┬───────┘
         │                │
         │                ▼
         │      ┌──────────────────────┐
         │      │ Fill in Form:        │
         │      │ • First Name         │
         │      │ • Last Name          │
         │      │ • Email              │
         │      │ • Password           │
         │      │ • Role (Student/Org) │
         │      └──────────┬───────────┘
         │                 │
         └────────┬────────┘
                  │
                  ▼
      ┌──────────────────────────────┐
      │  Backend Auth Processing     │
      │ • Hash Password              │
      │ • Create/Find User           │
      │ • Generate JWT Tokens        │
      │ • Return to Frontend         │
      └────────────┬─────────────────┘
                   │
                   ▼
      ┌──────────────────────────────┐
      │  Frontend Saves Tokens       │
      │ • Access Token → localStorage│
      │ • Refresh Token → localStorage
      │ • User Data → Redux State    │
      └────────────┬─────────────────┘
                   │
                   ▼
      ┌──────────────────────────────┐
      │    CHECK USER ROLE           │
      │   (From Redux State)         │
      └───┬──────────────────────┬───┘
          │                      │
      ┌───▼────────┐      ┌──────▼────────┐
      │  STUDENT   │      │  ORGANIZER    │
      └───┬────────┘      └──────┬────────┘
          │                      │
          ▼                      ▼
  ┌──────────────────┐  ┌──────────────────────┐
  │ /dashboard/      │  │ /dashboard/          │
  │ student          │  │ organizer            │
  │                  │  │                      │
  │ ┌──────────────┐ │  │ ┌──────────────────┐│
  │ │ Dashboard    │ │  │ │ Dashboard        ││
  │ │ Applications │ │  │ │ Events           ││
  │ │ Profile      │ │  │ │ Applicants       ││
  │ │ Ratings      │ │  │ │ Payments         ││
  │ │ Payments     │ │  │ │ Profile          ││
  │ └──────────────┘ │  │ └──────────────────┘│
  └──────────────────┘  └──────────────────────┘
          │                      │
          └─────────────┬────────┘
                        │
                        ▼
            ┌─────────────────────────┐
            │  User Explores Features │
            │ • Click Tabs            │
            │ • Edit Profile          │
            │ • View Stats            │
            │ • View Applications     │
            │ • Click Logout          │
            └────────────┬────────────┘
                         │
                         ▼
            ┌─────────────────────────┐
            │     LOGOUT BUTTON       │
            │  (Top-Right Corner)     │
            └────────────┬────────────┘
                         │
                         ▼
            ┌─────────────────────────┐
            │  Clear Tokens           │
            │  • Remove from Storage  │
            │  • Clear Redux State    │
            │  • Redirect to /login   │
            └────────────┬────────────┘
                         │
                         ▼
            ┌─────────────────────────┐
            │   Back to Login Page    │
            │  (Cycle can repeat)     │
            └─────────────────────────┘
```

---

## 📋 Step-by-Step Example: Student User

### Step 1: Navigate to Signup
```
User opens: http://localhost:5173
Sees: Home page with navigation
Clicks: "Sign Up" or goes to /signup
```

### Step 2: Fill Signup Form
```
Email:        john@example.com
Password:     Student@123456
First Name:   John
Last Name:    Doe
Role:         Student Volunteer ✓
```

### Step 3: Submit Form
```
Frontend validates all fields ✓
Sends POST to /api/auth/signup
Backend:
  - Checks email not taken ✓
  - Hashes password ✓
  - Creates user in DB ✓
  - Generates JWT tokens ✓
  - Sends back to frontend
```

### Step 4: Automatic Redirect
```
Frontend receives:
  - User object: { id, firstName, lastName, email, role: "student" }
  - accessToken: "eyJhbGc..."
  - refreshToken: "eyJhbGc..."

Saves to:
  - localStorage: accessToken, refreshToken
  - Redux: user object, isAuthenticated = true

Redirects to: /dashboard/student ✓✓✓
```

### Step 5: Student Dashboard Loads
```
User sees:
  - Welcome: "Welcome, John Doe! 👋"
  - Header with logout button
  - 4 stats cards (applications, accepted, pending, rating)
  - 5 tabs to click: Dashboard, Applications, Profile, Ratings, Payments
  - Dashboard tab is active by default
```

### Step 6: User Explores Dashboard
```
Clicks "Applications" tab:
  - Sees 2 sample applications
  - One is "Accepted", one is "Pending"
  - Can click "View Details"

Clicks "Profile" tab:
  - Sees form with all their info
  - Click "Edit" to modify
  - Change college, skills, phone
  - Click "Done" to save

Clicks "Ratings" tab:
  - Sees 0 rating (not yet rated)
  - Sees tips for improving rating

Clicks "Payments" tab:
  - No payment history yet
```

### Step 7: Logout
```
User clicks "Logout" button (top-right)
System:
  - Clears Redux state
  - Removes tokens from localStorage
  - Redirects to /login
  - Shows: "Logged out successfully"
```

---

## 💼 Step-by-Step Example: Organizer User

### Step 1: Navigate to Signup
```
User opens: http://localhost:5173
Sees: Home page with "Host Your Event" section
Clicks: "Sign Up" button
```

### Step 2: Fill Signup Form
```
Email:        jane@company.com
Password:     Organizer@123456
First Name:   Jane
Last Name:    Smith
Role:         Event Organizer ✓
```

### Step 3: Submit Form
```
Backend creates organizer user ✓
Generates tokens ✓
Sends back to frontend ✓
```

### Step 4: Automatic Redirect
```
Frontend detects: role = "organizer"
Redirects to: /dashboard/organizer ✓✓✓
```

### Step 5: Organizer Dashboard Loads
```
User sees:
  - Welcome: "Welcome, YourCompany! 👋"
  - Header with logout button
  - 4 stats cards (events, active, applicants, rating)
  - 5 tabs: Dashboard, Events, Applicants, Payments, Profile
  - Dashboard tab is active
```

### Step 6: User Explores Dashboard
```
Clicks "Events" tab:
  - Sees "Post New Event" button
  - No events posted yet (in this example)
  - Can click button to post event

Clicks "Applicants" tab:
  - Shows all applicants across events
  - Can accept/reject applications
  - Sees applicant ratings

Clicks "Payments" tab:
  - Shows payment history for event postings
  - Sees amount paid (₹599 for Featured plan)
  - Transaction status

Clicks "Profile" tab:
  - Can edit company name, description, website
  - Edit personal contact info
  - All fields editable (except email)
  - Save changes

Clicks "Dashboard" tab (returns to overview):
  - See quick actions
  - Revenue tracking
  - Key metrics
```

### Step 7: Logout
```
User clicks "Logout" button
System processes logout:
  - Clear all data
  - Redirect to login
  - Show success message
```

---

## 🔐 Security Features Throughout Journey

### During Login/Signup
```
✅ Password minimum 6 characters
✅ Email validation
✅ Unique email constraint
✅ Password hashing (bcryptjs)
✅ JWT token generation (7-day expiry)
✅ Refresh token (30-day expiry)
```

### In Dashboard
```
✅ Token required to access
✅ Role-based access control
✅ Token validation on each request
✅ Auto token refresh on expiration
✅ Secure logout
```

### Data Protection
```
✅ Passwords never shown/logged
✅ Tokens only in Authorization header
✅ localStorage tokens not accessible by JavaScript (except ours)
✅ CORS only allows frontend origin
✅ Rate limiting on auth endpoints
```

---

## 🔄 Token Refresh Flow

```
While User is Logged In:

1. User makes API request
   ├─ Axios adds token to header
   ├─ Authorization: Bearer {accessToken}
   └─ Sends request

2. Backend receives request
   ├─ Verifies token signature
   ├─ If valid: Process request ✓
   ├─ If expired: Return 401
   └─ If invalid: Return 401

3. Frontend receives 401
   ├─ Catch error in interceptor
   ├─ Extract refreshToken from localStorage
   ├─ Send to /auth/refresh-token endpoint
   └─ Get new accessToken

4. Backend validates refreshToken
   ├─ If valid: Generate new accessToken
   └─ If invalid: Return error (need re-login)

5. Frontend stores new token
   ├─ Update localStorage
   ├─ Retry original request
   └─ Request succeeds ✓

All transparent to user!
```

---

## 📊 Database State During Journey

### After Signup
```
MongoDB users collection:
{
  _id: ObjectId,
  email: "john@example.com",
  password: "$2a$10$..." (bcrypt hash),
  firstName: "John",
  lastName: "Doe",
  role: "student",
  college: null,
  skills: [],
  studentRating: 0,
  studentReviewCount: 0,
  isVerified: false,
  isActive: true,
  isSuspended: false,
  lastLogin: 2026-04-08T10:30:00Z,
  createdAt: 2026-04-08T10:30:00Z,
  updatedAt: 2026-04-08T10:30:00Z
}
```

### After Login (lastLogin Updated)
```
Same user but:
lastLogin: 2026-04-08T14:45:00Z (updated)
```

### After Profile Update
```
Same user but:
college: "ABC College",
skills: ["Event Planning", "Marketing"],
updatedAt: 2026-04-08T15:00:00Z (updated)
```

---

## 🎯 What Each Dashboard Page Does

### Student Dashboard
| Component | Purpose |
|-----------|---------|
| Header | Shows welcome message, user info, logout |
| Stats | Shows applications, accepted, pending, rating |
| Dashboard Tab | Overview of activity |
| Applications Tab | List of all applications with status |
| Profile Tab | Edit personal information |
| Ratings Tab | View rating and tips |
| Payments Tab | View payment history |

### Organizer Dashboard
| Component | Purpose |
|-----------|---------|
| Header | Shows company name, info, logout |
| Stats | Shows events, active, applicants, rating |
| Dashboard Tab | Overview with revenue and actions |
| Events Tab | Manage posted events |
| Applicants Tab | View and manage applicants |
| Payments Tab | View event posting payments |
| Profile Tab | Edit company information |

---

## 🎬 Complete Flow Summary

```
START → HOME PAGE → LOGIN/SIGNUP → AUTHENTICATE → GET TOKENS
   ↓
DETERMINE ROLE → REDIRECT TO DASHBOARD
   ↓
LOAD DASHBOARD (Student or Organizer)
   ↓
USER EXPLORES FEATURES
   ├─ View statistics
   ├─ Edit profile
   ├─ Click between tabs
   └─ Interact with content
   ↓
LOGOUT CLICK
   ↓
CLEAR DATA → REDIRECT TO LOGIN
   ↓
END (Ready to login again)
```

---

## 🚀 Ready to Start?

### Run the Application
```bash
# Terminal 1
mongod

# Terminal 2
cd /Users/dhyey/Desktop/EventMates/server
npm run dev

# Terminal 3
cd /Users/dhyey/Desktop/EventMates/client
npm run dev
```

### Test the Complete Flow
1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill form (choose role: Student or Organizer)
4. Click "Sign Up"
5. ✅ Dashboard loads automatically!
6. Explore all tabs and features
7. Click "Logout"
8. ✅ Redirected to login page

---

**Now you have a complete understanding of how the user journey works!**

Date: April 8, 2026
Status: ✅ Complete Implementation
