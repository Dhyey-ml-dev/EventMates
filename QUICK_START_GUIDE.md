# 🚀 QUICK START GUIDE - Event Management System

## ⚡ 5-Minute Setup

### 1. Install & Start Server
```bash
cd /Users/dhyey/Desktop/EventMates/server
npm run dev
```

**Expected Output:**
```
✅ EventMates Server is Running
📍 Port: 5001
✅ Successfully seeded 8 sample events!
```

### 2. Start Client
```bash
cd /Users/dhyey/Desktop/EventMates/client
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Visit Website
```
http://localhost:5173/
```

You'll see:
- ✅ 8 sample event cards on homepage
- ✅ Featured badge ⭐ on top events
- ✅ Beautiful images on each event
- ✅ Location, pay, and role information

---

## 🧪 TESTING SCENARIOS

### Scenario 1: Browse Sample Events
```
1. Go to http://localhost:5173
2. See "Featured Opportunities" section
3. View 8 sample events with images
4. Click "Browse Events" button
5. Use filters: location, pay range
6. Click "View Details" on any event
```

### Scenario 2: Admin Creates Event (Free)
```
1. Go to http://localhost:5173/admin
2. Login with admin credentials
3. Click blue "Create Event" button
4. Fill form:
   - Title: "Workshop 2026"
   - Description: "Great learning opportunity"
   - Location: "Ahmedabad, Gujarat"
   - Date: Tomorrow's date
   - Pay: 600
   - Role: "Facilitator"
5. Click "Create & Publish Event"
6. ✅ Event published instantly!
7. See it on /events page immediately
```

### Scenario 3: Organizer Posts Paid Event
```
1. Login as organizer
2. Go to /organizer/post-event
3. Fill event form completely:
   - Title: "My Event"
   - Description: "Event description"
   - Location: "SG Highway, Ahmedabad"
   - Date: Future date
   - Pay: 500
   - Role: "Volunteer"
4. Click "Post Event" button
5. ✅ Redirected to payment page
6. See two plans:
   - Basic: ₹299
   - Featured: ₹599 (with ⭐ badge)
7. Click "Pay ₹299"
8. Razorpay checkout opens
9. Use test card:
   - Number: 4111 1111 1111 1111
   - Expiry: 12/25
   - CVV: 123
10. Click Pay
11. ✅ Payment success!
12. Redirected to event details
13. ✅ Event published and visible
```

### Scenario 4: Test Payment Failure
```
1. Follow Scenario 3 steps 1-8
2. Use test fail card:
   - Number: 4000 0000 0000 0002
3. Payment fails
4. ✅ Error message shown
5. Event stays in draft
6. Organizer can retry
```

---

## 🔍 VERIFICATION CHECKLIST

After testing, verify:

### Homepage
- [ ] 8 sample event cards visible
- [ ] "Featured Opportunities" section shows
- [ ] Images load correctly
- [ ] Pay amounts displayed (₹700-₹1500)
- [ ] Location names show Ahmedabad
- [ ] Featured ⭐ badge on top 3 events
- [ ] "Browse Events" button works

### Browse Events Page
- [ ] All events visible
- [ ] Filter by location works
- [ ] Filter by pay range works
- [ ] Event cards show images
- [ ] Hover zoom effect works
- [ ] Pagination works (if >12 events)

### Event Details Page
- [ ] Large event image
- [ ] Full description visible
- [ ] Multiple roles displayed
- [ ] Pay amount clear
- [ ] "Apply" button works
- [ ] View counter increments

### Admin Dashboard
- [ ] "Create Event" button visible
- [ ] Modal form opens
- [ ] Form submission works
- [ ] Event appears on /events immediately
- [ ] Status shows "Published"

### Event Posting (Organizer)
- [ ] /organizer/post-event page loads
- [ ] Form has all fields
- [ ] Submit redirects to payment
- [ ] Payment page shows plans
- [ ] Razorpay opens on Pay click
- [ ] Success redirects correctly
- [ ] Event becomes visible

---

## 📊 DATABASE VERIFICATION

### Check Sample Events Seeded
```bash
# Open MongoDB
mongosh

# In shell:
use eventmates
db.events.countDocuments({isSample: true})
# Should show: 8

db.events.find({isSample: true}).limit(1)
# Should show sample event with all fields
```

### Check Event Fields
```bash
db.events.findOne({_id: ObjectId("...")})
# Should include:
# - isSample: true/false
# - createdByRole: "admin" or "organizer"
# - paymentStatus: "free", "pending", or "paid"
```

### Check Payments
```bash
db.payments.find({paymentType: "event-posting"})
# Should show payment records for event postings
```

---

## 🔧 CONFIGURATION CHECKLIST

### Server `.env`
```env
✅ MONGODB_URI=mongodb://localhost:27017/eventmates
✅ JWT_SECRET=eventmates_dev_secret_key_2026_super_secure_key
✅ PORT=5001
✅ RAZORPAY_KEY_ID=rzp_test_dev_key_id
✅ RAZORPAY_KEY_SECRET=rzp_test_dev_key_secret
✅ FRONTEND_URL=http://localhost:5173
```

### Client `.env`
```env
✅ VITE_API_URL=http://localhost:5001/api
✅ VITE_RAZORPAY_KEY_ID=rzp_test_1234567890
```

### index.html
```html
✅ <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Sample events already exist"
**Solution:** Skip is normal. Events already in database. Run:
```bash
mongosh
use eventmates
db.events.deleteMany({})
# Restart server
```

### Issue: "Razorpay checkout not opening"
**Solution:** Check:
1. Script loaded in index.html? ✅
2. .env has RAZORPAY_KEY_ID? ✅
3. Browser console has errors? Check
4. Network tab shows checkout.js? ✅

### Issue: "Payment verified but event not published"
**Solution:** Check MongoDB:
```bash
db.events.findOne({_id: ObjectId("your-event-id")})
# Check: paymentStatus should be "paid"
# Check: status should be "published"
```

### Issue: "Filter not working on /events"
**Solution:** 
- Clear browser cache
- Check Redux state
- Verify API response includes filtered results

### Issue: "Images not showing on event cards"
**Solution:**
- Check image URLs are valid
- Verify Unsplash URLs accessible
- Check browser console for CORS errors

---

## 📱 TESTING ON MOBILE

```bash
# On same network:
1. Get your computer's IP: ipconfig getifaddr en0 (Mac)
2. On phone, go to: http://YOUR_IP:5173/
3. Test all features on mobile
4. Check responsive design
5. Test touch events
```

---

## 📊 PERFORMANCE TESTING

### Test Sample Data Load Time
```bash
curl http://localhost:5001/api/events
# Should return 8+ events in <500ms
```

### Test Image Loading
```bash
# Open DevTools → Network tab
# Go to /events page
# Check image sizes load in <1s
# Look for lazy loading (placeholder first)
```

### Test Payment Flow Speed
```bash
1. Time from event form to payment page: <2s
2. Time for Razorpay checkout to open: <3s
3. Time from payment success to redirect: <2s
```

---

## 🎯 SUCCESS INDICATORS

✅ **You're successful when:**

1. **Sample Events Show**
   - 8 events visible on homepage
   - All Ahmedabad locations
   - Pay ranges ₹700-₹1500
   - Quality images display

2. **Filters Work**
   - Location filter returns results
   - Pay range narrows down events
   - Search finds events by title

3. **Admin Can Post**
   - Create event modal opens
   - Submit creates event
   - Event visible immediately

4. **Payment Works**
   - Organizer event → payment page
   - Plan selection possible
   - Razorpay checkout opens
   - Test payment succeeds
   - Event published after payment

5. **Badges Show**
   - ⭐ Featured badge on premium events
   - ✓ Verified badge on admin events
   - Sample badge on pre-seeded events

---

## 📞 DEBUGGING TIPS

### Check Logs
```bash
# Server logs show everything:
npm run dev
# Look for:
# ✅ Successfully seeded X events
# ✅ Event created
# ✅ Payment initiated
# ✅ Payment verified
```

### Browser DevTools
```
1. Open DevTools (F12)
2. Console tab: Check for errors
3. Network tab: Check API calls
4. Application tab: Check .env variables
5. Redux DevTools: Check state
```

### Test API Directly
```bash
curl http://localhost:5001/api/events
# Should return all events as JSON
```

---

## 🚀 NEXT STEPS

After verification:

1. **Deploy to staging**
   - Get Razorpay test keys
   - Push to staging server
   - Test full flow

2. **Get Razorpay Live Keys**
   - Apply at https://razorpay.com/
   - Get merchant account approved
   - Receive live keys

3. **Go Live**
   - Update live environment variables
   - Deploy to production
   - Monitor payments
   - Track metrics

4. **Marketing**
   - Show sample events to users
   - Promote event posting to organizers
   - Track conversion rates

---

## 📚 DOCUMENTATION LINKS

- **EVENT_SYSTEM_DOCUMENTATION.md** - Complete technical docs
- **IMPLEMENTATION_SUMMARY.md** - Feature overview
- **This file** - Quick start guide

---

**Status:** Ready for Testing ✅
**Date:** April 7, 2026
**Version:** 1.0.0

Good luck! 🎉
