# 🧪 Quick Testing Guide - Event Hosting & Sample Events

## ⚡ Quick Start

```bash
# 1. Terminal 1 - Start Backend
cd /Users/dhyey/Desktop/EventMates/server
npm run dev

# Expected output:
# ✅ Sample events already exist (8 found). Skipping seed.
# 🚀 EventMates Server is Running
# 📍 Port: 5001

# 2. Terminal 2 - Start Frontend  
cd /Users/dhyey/Desktop/EventMates/client
npm run dev

# Expected output:
# ✅ Local: http://localhost:5173/
```

---

## 📋 Test Scenarios

### Scenario 1: View Sample Events (Student)

**Steps:**
1. Open http://localhost:5173
2. Look for "🏙️ Ahmedabad Events Happening Now" section
3. Scroll down to see 6 sample events displayed

**Expected Results:**
- ✅ See all 8 events (first 6 on homepage)
- ✅ Each card shows:
  - Event title
  - Event image (professional photo)
  - Pay amount (₹700-₹1500)
  - Location (Ahmedabad area)
  - Badges: "Sample", "Verified", "Featured"
  - Number of interested volunteers

**Sample Events to Look For:**
- College Tech Fest Volunteer (₹800)
- Wedding Event Assistant (₹1200)
- Music Concert Crew (₹1500)
- Startup Expo Helper (₹1000)

---

### Scenario 2: Browse & Filter Events

**Steps:**
1. Click "Browse Events" in navbar
2. View all events list
3. Test filters:
   - Search: Type "tech" → Should show Tech Fest event
   - Location: Type "Ahmedabad" → Should filter events
   - Pay Range: Set ₹800-₹1200 → Should show matching events

**Expected Results:**
- ✅ All 8 sample events visible
- ✅ Filters work in real-time
- ✅ Can click "View Details" on any event
- ✅ Sample badge visible on all cards

---

### Scenario 3: View Event Details

**Steps:**
1. From Browse Events, click any event card
2. View full event details page
3. Check:
   - Full description
   - Location
   - Date & Time
   - Available roles (5-10 roles)
   - Pay amount
   - Requirements

**Expected Results:**
- ✅ Full event information displays
- ✅ See multiple volunteer roles with:
  - Role title
  - Number of positions
  - Role description
- ✅ "Apply Now" button visible
- ✅ Event image displays prominently

---

### Scenario 4: Apply for Event (Student)

**Steps:**
1. Click "Apply" on any event
2. Should redirect to login if not authenticated
3. After login, you should be able to apply

**Expected Results:**
- ✅ Application recorded
- ✅ Toast notification: "Applied successfully"
- ✅ Application count increments on card

---

### Scenario 5: Post a Paid Event (Organizer)

**Prerequisites:**
- Must be signed up as **Organizer** role

**Steps:**
1. Click "Post Event" in navbar
2. Fill form with:
   - Title: "My Concert Event"
   - Description: "Help us organize a concert"
   - Location: "Ahmedabad"
   - Date: Pick a date
   - Pay: ₹1000
   - Roles: Add 2-3 roles
   - Add requirements
3. Click "Submit"

**Expected Results:**
- ✅ Form validates
- ✅ Redirects to `/payment/event-posting`
- ✅ Two pricing plans display:
  - Basic: ₹299
  - Featured: ₹599

---

### Scenario 6: Complete Payment (Razorpay)

**Prerequisites:**
- Just filled out event form (Scenario 5)

**Steps:**
1. On payment page, choose plan (e.g., Basic ₹299)
2. Review order summary
3. Click "Pay ₹299" button
4. Razorpay popup appears
5. Use **Test Cards:**
   ```
   Card Number: 4111111111111111
   Expiry: 12/25
   CVV: 123
   ```
6. Complete payment

**Expected Results:**
- ✅ Razorpay popup opens
- ✅ Payment processes
- ✅ Redirects to event details page
- ✅ Toast: "Payment successful! Event published!"
- ✅ Event status = "published"
- ✅ Event now visible in "Browse Events"

---

### Scenario 7: Admin Creates Free Event

**Prerequisites:**
- Must be logged in as **Admin**

**Steps:**
1. Navigate to `/admin/events/manage` (or click from admin dashboard)
2. Click "Create Event"
3. Fill event details (same as organizer, but no payment required)
4. Click "Create Event"

**Expected Results:**
- ✅ Event created successfully
- ✅ Toast: "Event created and published successfully!"
- ✅ Redirects to admin dashboard
- ✅ Event appears immediately in Browse Events
- ✅ No payment charge
- ✅ Status = "published" immediately

---

### Scenario 8: View "Host Your Event" Section

**Steps:**
1. Go to homepage (http://localhost:5173)
2. Scroll to "Need Volunteers for Your Event?" section
3. Review benefits:
   - Quick & Easy Setup
   - Vetted Volunteers
   - Affordable & Transparent

**Expected Results:**
- ✅ Section displays with image on left
- ✅ Benefits clearly listed
- ✅ CTA button: "Host Your Event Now"
- ✅ Button redirects to `/signup?role=organizer`

---

## 🧬 Database Check (Optional)

```bash
# Connect to MongoDB and check:

# 1. Sample events were created
db.events.find({ isSample: true }).count()
# Expected: 8

# 2. Sample events are marked correctly
db.events.findOne({ isSample: true })
# Should show: isSample: true, createdByRole: "admin", paymentStatus: "free"

# 3. Verify event images
db.events.findOne({ title: "College Tech Fest Volunteer" })
# Should have eventImage URL from Unsplash
```

---

## 🐛 Troubleshooting

### **Sample events not showing?**
```bash
# Check server logs for seed message
# Look for: "✅ Successfully seeded 8 sample events!"
# If it says "already exist", events are in DB
```

### **Payment page not loading?**
```bash
# Check .env files:
# /client/.env → VITE_RAZORPAY_KEY_ID must be set
# /server/.env → RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET must be set
```

### **Images not loading?**
```bash
# Events use Unsplash URLs - should load from internet
# Check browser console for CORS errors
# Images already optimized via imageUtils.js
```

### **Filters not working?**
```bash
# Make sure backend getAllEvents endpoint accepts filters
# Check query parameters in BrowseEventsPage.jsx
# Default query should be: { status: 'published' }
```

---

## ✅ Test Checklist

Use this to verify everything works:

- [ ] Sample events visible on homepage
- [ ] All 8 events show correct details
- [ ] Browse Events page loads all events
- [ ] Search filter works
- [ ] Location filter works  
- [ ] Pay range filter works
- [ ] Event detail page shows full info
- [ ] Event card shows image, pay, location, badges
- [ ] Organizer can post event
- [ ] Payment page displays 2 plans
- [ ] Razorpay payment popup opens
- [ ] Payment completes successfully
- [ ] Event published after payment
- [ ] Admin can create event without payment
- [ ] Event appears in browse immediately
- [ ] "Host Your Event" section visible on homepage
- [ ] CTA buttons work correctly
- [ ] All badges display (Featured, Verified, Sample)

---

## 📊 Key Metrics to Track

```
Sample Events: 8
- Featured: 3 (Tech Fest, Wedding, Startup)
- Verified: All 8
- Locations: Ahmedabad city

Event Cards Display:
- Image: ✅
- Title: ✅
- Pay: ✅
- Location: ✅
- Badges: ✅

Payment Flows:
- Organizer paid: Yes (₹299-₹599)
- Admin free: Yes
- Payment verified: Razorpay integration
```

---

## 🎯 Success Criteria

Platform is **READY** when:

1. ✅ Student visits site, sees 8 Ahmedabad events
2. ✅ Can browse, search, filter events
3. ✅ Organizer can post event with payment
4. ✅ Payment completes via Razorpay
5. ✅ Event published automatically after payment
6. ✅ Admin can create events for free
7. ✅ All images load properly
8. ✅ Event cards display all required info
9. ✅ No console errors
10. ✅ Responsive on mobile

---

**Test Duration:** ~30 minutes
**Success Rate Target:** 100%
**Status:** Ready for QA

Last updated: April 8, 2026
