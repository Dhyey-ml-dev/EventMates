# EventMates - Event Management & Monetization System

## 📋 Overview

This document outlines the complete event management system with sample events, admin event creation, and paid organizer event posting.

---

## 🎯 SYSTEM ARCHITECTURE

### Event Types

1. **Sample Events** (Pre-seeded, Free)
   - Auto-populated on first server startup
   - isSample: true
   - createdByRole: "admin"
   - paymentStatus: "free"
   - status: "published"
   - Visible to all users on homepage and browse pages

2. **Admin-Created Events** (Free)
   - Created by admin through modal or API
   - createdByRole: "admin"
   - paymentStatus: "free"
   - status: "published" (immediately)
   - No payment required

3. **Organizer-Posted Events** (Paid)
   - Created by organizers through `/organizer/post-event`
   - Requires payment before publication
   - createdByRole: "organizer"
   - paymentStatus: "pending" → "paid"
   - status: "draft" → "published"
   - Payment plans:
     - Basic: ₹299 (30-day duration)
     - Featured: ₹599 (30-day duration + featured placement)

---

## 📊 DATABASE SCHEMA

### Event Model (Updated)

```javascript
{
  // Existing fields
  organizerId: ObjectId,
  title: String,
  description: String,
  location: String,
  eventDate: Date,
  eventEndDate: Date,
  startTime: String,
  endTime: String,
  roles: [{
    title: String,
    count: Number,
    description: String
  }],
  pay: {
    amount: Number,
    currency: String (default: 'INR'),
    paymentType: String (enum: ['hourly', 'fixed'])
  },
  status: String (enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled']),
  eventImage: String,
  category: String,
  requirements: [String],
  maxApplicants: Number,
  applicants: [{ studentId, appliedDate }],
  selectedCandidates: [ObjectId],
  isVerified: Boolean,
  isFeatured: Boolean,

  // NEW FIELDS
  isSample: Boolean (default: false),
  createdByRole: String (enum: ['admin', 'organizer'], default: 'organizer'),
  paymentStatus: String (enum: ['pending', 'paid', 'free'], default: 'pending'),

  timestamps: true
}
```

### Payment Model (Used for Event Posting)

```javascript
{
  organizerId: ObjectId,
  studentId: ObjectId,
  eventId: ObjectId,
  applicationId: ObjectId,
  paymentType: String (enum: ['event-posting', 'student-payment', 'platform-fee', 'refund']),
  amount: Number,
  currency: String (default: 'INR'),
  paymentStatus: String (enum: ['pending', 'completed', 'failed', 'refunded']),
  paymentMethod: String (default: 'razorpay'),
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  transactionId: String,
  timestamps: true
}
```

---

## 🚀 FEATURE IMPLEMENTATION

### 1. SAMPLE EVENTS

**Location:** `/server/src/seeds/sampleEvents.js`

**Sample Data Included:**
1. College Tech Fest Volunteer - ₹800/day - Ahmedabad University
2. Wedding Event Assistant - ₹1200/day - SG Highway
3. Music Concert Crew - ₹1500/day - GMDC Ground
4. Startup Expo Helper - ₹1000/day - IIM Ahmedabad
5. Sports Event Volunteer - ₹900/day - Narendra Modi Stadium
6. NGO Fundraising Event - ₹700/day - Riverfront
7. Food Festival Staff - ₹1100/day - Karnavati Club
8. Corporate Seminar Assistant - ₹1000/day - Prahladnagar

**Auto-Seeding:**
- Called on server startup in `/server/src/server.js`
- Checks if sample events already exist (idempotent)
- Logs success/skip messages

**Database Update:**
```bash
# On first run after deployment
npm run dev
# Output: ✅ Successfully seeded 8 sample events!

# On subsequent runs
# Output: ✅ Sample events already exist. Skipping seed.
```

---

### 2. ADMIN EVENT CREATION

**Flow:**
1. Admin creates event through modal in AdminDashboard
2. Event status: "published" immediately
3. paymentStatus: "free"
4. No payment required
5. Event appears on website instantly

**Routes:**
- `POST /api/events` (Admin can create)
  - Authorization: admin or organizer
  - Returns event immediately

**Frontend:** AdminDashboard.jsx (modal form)

**Controller Logic:**
```javascript
if (userRole === 'admin') {
  status = 'published';
  paymentStatus = 'free';
} else {
  status = 'draft';
  paymentStatus = 'pending';
}
```

---

### 3. ORGANIZER PAID EVENT POSTING

**Complete Flow:**

```
1. Organizer clicks "Post Event" button
   ↓
2. Fill event form on /organizer/post-event
   ↓
3. Click "Post Event" button
   ↓
4. Redirect to /payment/event-posting (EventPostingPaymentPage)
   ↓
5. Choose plan: Basic (₹299) or Featured (₹599)
   ↓
6. Click "Pay ₹X" button
   ↓
7. Razorpay checkout opens
   ↓
8. Complete payment
   ↓
9. Backend verifies signature
   ↓
10. Event status: draft → published
11. paymentStatus: pending → paid
12. If Featured: isFeatured: true
   ↓
13. Redirect to event details page
   ↓
14. Event live on website!
```

**Routes:**
- `POST /api/events` (Organizer creates in draft)
- `POST /api/payments/events/initiate-event-posting` (Initiate payment)
- `POST /api/payments/verify` (Verify payment)

**Payment Plans:**
```javascript
{
  basic: {
    amount: 299,
    description: 'Basic Event Posting',
    features: ['Event posting', 'Applicant management', '30-day duration']
  },
  featured: {
    amount: 599,
    description: 'Featured Listing',
    features: ['Featured placement', 'Priority listing', 'Social media share', '30-day duration']
  }
}
```

**Frontend Pages:**
1. `/organizer/post-event` - EventPostingPage (form)
2. `/payment/event-posting` - EventPostingPaymentPage (Razorpay)

---

## 🔧 BACKEND IMPLEMENTATION

### Controllers

**1. eventController.js - createEvent()**

```javascript
export const createEvent = async (req, res) => {
  const organizerId = req.user.userId;
  const userRole = req.user.role;
  
  const isAdmin = userRole === 'admin';
  const initialStatus = isAdmin ? 'published' : 'draft';
  const paymentStatus = isAdmin ? 'free' : 'pending';
  
  const newEvent = await Event.create({
    ...eventData,
    status: initialStatus,
    paymentStatus,
    createdByRole: userRole,
  });
};
```

**2. paymentController.js - initiateEventPostingPayment()**

```javascript
export const initiateEventPostingPayment = async (req, res) => {
  const { eventId, planType } = req.body;
  
  // Validate event
  // Create Razorpay order
  // Create payment record
  // Mark event as featured if premium plan
  // Return order details
};
```

**3. paymentController.js - verifyPayment() (Updated)**

```javascript
export const verifyPayment = async (req, res) => {
  // Verify Razorpay signature
  
  if (payment.paymentType === 'event-posting' && payment.eventId) {
    // Update event: paymentStatus = 'paid', status = 'published'
  }
};
```

### Routes

**Payment Routes:**
```javascript
// /server/src/routes/paymentRoutes.js
POST /api/payments/initiate
POST /api/payments/verify
GET  /api/payments/history
POST /api/payments/:paymentId/refund
POST /api/payments/events/initiate-event-posting  // NEW
```

**Event Routes:**
```javascript
// /server/src/routes/eventRoutes.js
POST /api/events                    // Both admin & organizer
PUT  /api/events/:eventId
PATCH /api/events/:eventId/publish
PATCH /api/events/:eventId/publish-after-payment  // NEW
DELETE /api/events/:eventId
GET  /api/events
GET  /api/events/:eventId
GET  /api/events/organizer/my-events
```

---

## 🎨 FRONTEND COMPONENTS

### 1. EventCard Component (Enhanced)

**Features:**
- Lazy loading images
- Badges: Featured ⭐, Verified ✓, Sample
- Pay amount (₹XXX)
- Location with icon
- Hover zoom effect
- Responsive (mobile-first)

**Badges Shown:**
```jsx
{event.isFeatured && <Badge>⭐ Featured</Badge>}
{event.isVerified && <Badge>✓ Verified</Badge>}
{event.isSample && <Badge>Sample</Badge>}
```

### 2. BrowseEventsPage (With Filters)

**Filters:**
- Search (title/description)
- Location
- Min Pay (₹)
- Max Pay (₹)
- Pagination

**Sample events displayed** if no real events exist

### 3. EventPostingPaymentPage (New)

**Components:**
- Plan selector (Basic/Featured)
- Order summary
- Razorpay integration
- Success redirect

**Environment Variables:**
```
VITE_RAZORPAY_KEY_ID=rzp_test_... # Public key for checkout
```

### 4. AdminEventManagement (New)

**Form Fields:**
- Title, description, location
- Date & time picker
- Roles with counts
- Requirements
- Payment amount & type
- Image URL
- Featured checkbox

**Direct publish** (no payment)

---

## 📝 CONFIGURATION

### Server `.env`

```env
# Razorpay (Test Keys)
RAZORPAY_KEY_ID=rzp_test_dev_key_id
RAZORPAY_KEY_SECRET=rzp_test_dev_key_secret

# For production, use live keys from Razorpay dashboard
# RAZORPAY_KEY_ID=rzp_live_...
# RAZORPAY_KEY_SECRET=rzp_live_...
```

### Client `.env`

```env
VITE_API_URL=http://localhost:5001/api
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890  # Public key
```

---

## 🧪 TESTING GUIDE

### 1. Test Sample Events

```bash
# Clear database (optional)
# mongosh
# use eventmates
# db.events.deleteMany({})

# Start server
cd server && npm run dev

# Check logs
# ✅ Successfully seeded 8 sample events!

# Visit homepage
# http://localhost:5173/

# Should see 8 featured event cards with images
```

### 2. Test Admin Event Creation

```bash
# Login as admin
# Go to /admin

# Click "Create Event" button
# Fill form
# Submit

# Event should appear immediately on /events page
# Status: published
# paymentStatus: free
```

### 3. Test Organizer Paid Posting

```bash
# Login as organizer
# Go to /organizer/post-event

# Fill event form with:
# - Title: "Test Event"
# - Description: "Test desc"
# - Location: "Ahmedabad"
# - Pay: 500
# - Date: future date
# - Role: "Tester"

# Click "Post Event"
# Redirected to /payment/event-posting

# Select plan: Basic (₹299) or Featured (₹599)

# Click "Pay ₹299"
# Razorpay checkout opens

# Use test card: 4111 1111 1111 1111
# Exp: 12/25, CVV: 123

# Payment completes
# Redirected to event details page
# Event status: published
# Event visible on /events page
```

### 4. Test Razorpay Integration

**Using Razorpay Test Keys:**

```
Test Card: 4111 1111 1111 1111
Expiry: Any future date (12/25)
CVV: Any 3 digits (123)
OTP: 123456 (if prompted)
```

**Test Failure:**
```
Card: 4000 0000 0000 0002
(Will fail payment)
```

---

## 📊 MONETIZATION METRICS

### Revenue Model

1. **Event Posting Fee** (Per Event)
   - Basic: ₹299/event/month
   - Featured: ₹599/event/month
   - Average organizer: 2-3 events/month
   - **Monthly revenue per organizer: ₹600-₹1800**

2. **Platform Growth**
   - Month 1: 10 organizers = ₹6,000-₹18,000
   - Month 3: 50 organizers = ₹30,000-₹90,000
   - Month 6: 200 organizers = ₹120,000-₹360,000

3. **Future Revenue Streams**
   - Featured event boost (₹299 extra/week)
   - Verified badge service (₹99/month)
   - Event analytics premium (₹199/month)
   - Student certification (₹49/month)

---

## 🔐 SECURITY CONSIDERATIONS

1. **Razorpay Signature Verification**
   - Validates: `SHA256(orderId|paymentId)` against signature
   - Prevents payment tampering
   - Prevents fraudulent payment claims

2. **Event Ownership Check**
   - Only organizer can modify their draft event
   - Only creator can delete event
   - Admin can override any event

3. **Payment Status Validation**
   - Event only publishes after `paymentStatus = 'paid'`
   - Prevents free posting by organizers
   - Admin events bypass this check

4. **XSS & CSRF Protection**
   - All inputs validated
   - Environment variables never exposed to client
   - CORS enabled for frontend domain only

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Get Razorpay live keys (apply on razorpay.com)
- [ ] Update server `.env` with live keys
- [ ] Update client `.env` with live public key
- [ ] Test payment flow with live keys
- [ ] Monitor payments in Razorpay dashboard
- [ ] Setup email notifications for new events
- [ ] Implement event expiry cleanup job
- [ ] Setup analytics tracking
- [ ] Create admin dashboard for payment analytics

---

## 📞 SUPPORT

For issues:
1. Check Razorpay dashboard for payment logs
2. Verify Razorpay keys are correct
3. Check browser console for errors
4. Check server logs: `npm run dev` output
5. Verify MongoDB connection

---

## 🎓 KEY FILES

**Backend:**
- `/server/src/models/Event.js` - Event schema
- `/server/src/models/Payment.js` - Payment schema
- `/server/src/controllers/eventController.js` - Event logic
- `/server/src/controllers/paymentController.js` - Payment logic
- `/server/src/seeds/sampleEvents.js` - Sample data
- `/server/src/routes/eventRoutes.js` - Event endpoints
- `/server/src/routes/paymentRoutes.js` - Payment endpoints

**Frontend:**
- `/client/src/pages/PostEventPage.jsx` - Event form
- `/client/src/pages/EventPostingPaymentPage.jsx` - Payment UI
- `/client/src/pages/AdminEventManagement.jsx` - Admin event creation
- `/client/src/pages/BrowseEventsPage.jsx` - Event listing
- `/client/src/components/EventCard.jsx` - Event display
- `/client/src/App.jsx` - Routing

**Configuration:**
- `/server/.env` - Server secrets
- `/client/.env` - Client config
- `/client/index.html` - Razorpay script import

---

**Version:** 1.0
**Last Updated:** April 7, 2026
**Status:** Production Ready
