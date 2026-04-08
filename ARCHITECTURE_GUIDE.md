# 🏗️ Event Hosting System - Architecture & Data Flow

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         EVENTMATES PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                       FRONTEND (React + Vite)                     │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  HomePage                 BrowseEventsPage        PostEventPage │   │
│  │  ├─ Hero Section          ├─ Event List           ├─ Form       │   │
│  │  ├─ Sample Events (6)     ├─ Filters              ├─ Validation │   │
│  │  ├─ "Host Event" CTA      ├─ Pagination          ├─ Submit     │   │
│  │  └─ Why Us Section        └─ Detail View         ↓ Redirect    │   │
│  │                                                  EventPostingPaymentPage
│  │                                                  ├─ Plan Selection
│  │  EventCard                AdminEventMgmt         ├─ Razorpay Widget
│  │  ├─ Image                 ├─ Create Event        ├─ Payment Flow
│  │  ├─ Title                 ├─ Publish Direct      └─ Success/Failure
│  │  ├─ Pay                   └─ No Payment Fee
│  │  ├─ Location                                     
│  │  └─ Badges                                        
│  │     ├─ Featured ⭐                               
│  │     ├─ Verified ✓                                
│  │     └─ Sample 🔵                                 
│  │                                                   
│  └──────────────────────────────────────────────────────────────────┘   │
│                                  ↓                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    BACKEND (Node + Express)                       │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  Event Controller          Payment Controller      Event Routes │   │
│  │  ├─ createEvent()          ├─ initiatePayment()   ├─ GET /     │   │
│  │  │  ├─ Admin: free         ├─ verifyPayment()     ├─ GET /:id  │   │
│  │  │  ├─ Org: pending        └─ initiateEventPost   ├─ POST /    │   │
│  │  │                                                 ├─ PUT /:id  │   │
│  │  ├─ updateEvent()          Seeds                  └─ PATCH publish
│  │  ├─ publishEvent()         └─ sampleEvents.js     
│  │  │  ├─ If paid ✓           (8 Ahmedabad events)   Payment Routes
│  │  │  └─ Publish             Auto-seed on startup   ├─ POST /initiate
│  │  │                                                 ├─ POST /verify
│  │  └─ publishEventAfterPayment()                    └─ POST /events/...
│  │                            
│  │  Database                  Razorpay Integration                      │
│  │  └─ Event Model            ├─ Order Creation                       │   │
│  │     ├─ createdByRole       ├─ Signature Verify                     │   │
│  │     ├─ isSample            └─ Status Updates                       │   │
│  │     └─ paymentStatus                               
│  │                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                         DATABASE (MongoDB)                        │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  Events Collection                                              │   │
│  │  ├─ _id: ObjectId                                              │   │
│  │  ├─ title: String                                              │   │
│  │  ├─ description: String                                        │   │
│  │  ├─ location: String (Ahmedabad)                               │   │
│  │  ├─ eventImage: URL (Unsplash)                                 │   │
│  │  ├─ pay: { amount, paymentType }                               │   │
│  │  ├─ roles: [ { title, count, description } ]                   │   │
│  │  ├─ status: 'draft' | 'published' | 'ongoing' ...             │   │
│  │  ├─ createdByRole: 'admin' | 'organizer'  ← NEW               │   │
│  │  ├─ isSample: boolean  ← NEW                                   │   │
│  │  ├─ paymentStatus: 'pending' | 'paid' | 'free'  ← NEW          │   │
│  │  ├─ isFeatured: boolean                                        │   │
│  │  └─ createdAt, updatedAt                                       │   │
│  │                                                                  │   │
│  │  Payments Collection                                            │   │
│  │  ├─ eventId: ObjectId                                          │   │
│  │  ├─ amount: Number (299 or 599)                                │   │
│  │  ├─ paymentType: 'event-posting'                               │   │
│  │  ├─ razorpayOrderId: String                                    │   │
│  │  ├─ razorpayPaymentId: String                                  │   │
│  │  └─ paymentStatus: 'completed'                                 │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  External Services                                                       │
│  ├─ Razorpay (Payment Gateway)                                         │   │
│  ├─ Unsplash (Event Images)                                            │   │
│  └─ MongoDB Atlas (Cloud Database)                                     │   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Flow 1: Student Views Sample Events

```
┌─────────────────────────────────────┐
│  Student Visits homepage            │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  HomePage Component Mounts           │
│  dispatch(getAllEvents({             │
│    status: 'published',              │
│    location: 'Ahmedabad',            │
│    limit: 6                          │
│  }))                                 │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  Backend: GET /api/events            │
│  Query: { status: 'published',        │
│          location: 'Ahmedabad' }     │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  MongoDB: Find events where           │
│  - isSample: true                    │
│  - location contains 'Ahmedabad'     │
│  - status: 'published'               │
│  Returns: 6-8 events                 │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  Frontend: Display EventCards        │
│  ├─ Title                            │
│  ├─ Image (optimized, lazy loaded)   │
│  ├─ Pay: ₹700-₹1500                  │
│  ├─ Location: Ahmedabad              │
│  └─ Badges: Sample, Verified, etc.   │
└─────────────────────────────────────┘
```

### Flow 2: Organizer Posts Paid Event

```
┌──────────────────────────────────┐
│  Organizer clicks "Post Event"   │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  PostEventPage Form              │
│  ├─ Title                         │
│  ├─ Description                   │
│  ├─ Location                      │
│  ├─ Pay (₹800-₹2000)              │
│  ├─ Roles (5-10)                  │
│  └─ Image upload                  │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  organizer clicks "Submit"        │
│  Creates event with:             │
│  - createdByRole: 'organizer'    │
│  - status: 'draft'                │
│  - paymentStatus: 'pending'       │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Backend: POST /api/events        │
│  Returns: eventId (unsaved yet)   │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Redirect to EventPostingPayment  │
│  Page with eventId & eventData    │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  EventPostingPaymentPage          │
│  Shows 2 plans:                   │
│  - Basic: ₹299                    │
│  - Featured: ₹599                 │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Organizer chooses plan & clicks  │
│  "Pay ₹299" or "Pay ₹599"        │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Backend: POST /api/payments/...  │
│  initiateEventPostingPayment()    │
│  ├─ Create Razorpay Order         │
│  ├─ Save Payment record (pending) │
│  └─ Return order details          │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Razorpay Popup Opens             │
│  Test Card: 4111111111111111      │
│  Organizer completes payment      │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Backend: POST /api/payments/verify│
│  ├─ Verify signature              │
│  ├─ Mark payment as 'completed'   │
│  ├─ Update event:                 │
│  │  ├─ status: 'published'        │
│  │  ├─ paymentStatus: 'paid'      │
│  │  └─ isFeatured: true (if plan) │
│  └─ Return success                │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Frontend: Success Page           │
│  Toast: "Event published!"        │
│  Redirect to /events              │
│  Event now visible to all!        │
└──────────────────────────────────┘
```

### Flow 3: Admin Creates Free Event

```
┌──────────────────────────────────┐
│  Admin logs in & goes to          │
│  /admin/events/manage             │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  AdminEventManagement Page        │
│  Fills event form (same as org)   │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Admin clicks "Create Event"      │
│  Backend: POST /api/events        │
│  Detects: req.user.role = 'admin' │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Controller Logic:                │
│  if (isAdmin) {                   │
│    event.status = 'published'     │
│    event.paymentStatus = 'free'   │
│    event.createdByRole = 'admin'  │
│  }                                │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  MongoDB: Save event              │
│  Returns: created event doc       │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│  Frontend: Success                │
│  Toast: "Event published!"        │
│  Redirect to admin dashboard      │
│  Event immediately visible        │
└──────────────────────────────────┘
```

---

## 📊 Sample Events Seed Data

When server starts, automatically creates 8 events:

```javascript
Sample Events Auto-Seeded:
├─ 1. College Tech Fest (₹800)
│  └─ Location: Ahmedabad University
│     Roles: Registration, Crowd Mgmt, Tech Support
│     Image: tech-fest.jpg (Unsplash)
│     isSample: true, isVerified: true, isFeatured: true
│
├─ 2. Wedding Event (₹1200)
│  └─ Location: SG Highway
│     Roles: Guest Coord, Setup Crew, Vendor Coord
│     Image: wedding.jpg
│     isSample: true, isVerified: true, isFeatured: true
│
├─ 3. Music Concert (₹1500)
│  └─ Location: GMDC Ground
│     Roles: Usher, Sound Tech, Stage Crew
│     Image: concert.jpg
│     isSample: true, isVerified: true
│
├─ 4. Startup Expo (₹1000)
│  └─ Location: IIM Ahmedabad
│     Roles: Booth Assist, Registration, Networking
│     Image: startup.jpg
│     isSample: true, isVerified: true, isFeatured: true
│
├─ 5. Sports Event (₹900)
│  └─ Location: Narendra Modi Stadium
│     Roles: Crowd Manager, Scorer, First Aid
│     Image: sports.jpg
│     isSample: true, isVerified: true
│
├─ 6. NGO Fundraiser (₹700)
│  └─ Location: Riverfront
│     Roles: Donation Counter, Event Coord, Guide
│     Image: ngo.jpg
│     isSample: true, isVerified: true
│
├─ 7. Food Festival (₹1100)
│  └─ Location: Karnavati Club
│     Roles: Stall Manager, Server, Event Coord
│     Image: food.jpg
│     isSample: true, isVerified: true, isFeatured: true
│
└─ 8. Corporate Seminar (₹1000)
   └─ Location: Prahladnagar
      Roles: Registration, Logistics, Tech Support
      Image: corporate.jpg
      isSample: true, isVerified: true
```

---

## 💳 Payment System Architecture

```
┌─────────────────────────────────────────────────┐
│         RAZORPAY PAYMENT INTEGRATION              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Step 1: Initiate Payment                      │
│  ┌─────────────────────────────────────────┐   │
│  │ POST /api/payments/events/...           │   │
│  │ Body: {                                 │   │
│  │   eventId: "....",                      │   │
│  │   planType: 'basic' | 'featured'        │   │
│  │ }                                       │   │
│  │                                         │   │
│  │ Response: {                             │   │
│  │   razorpayOrder: { id, amount },        │   │
│  │   payment: { _id, razorpayOrderId },    │   │
│  │   planType, amount                      │   │
│  │ }                                       │   │
│  └─────────────────────────────────────────┘   │
│                  ↓                              │
│  Step 2: Open Razorpay Popup                   │
│  ┌─────────────────────────────────────────┐   │
│  │ const options = {                       │   │
│  │   key: RAZORPAY_KEY_ID,                 │   │
│  │   order_id: razorpayOrder.id,           │   │
│  │   amount: amount * 100 (paise),         │   │
│  │   handler: (response) => {...}          │   │
│  │ }                                       │   │
│  │ rzp = new Razorpay(options)             │   │
│  │ rzp.open()                              │   │
│  └─────────────────────────────────────────┘   │
│                  ↓                              │
│  Step 3: Verify Payment                        │
│  ┌─────────────────────────────────────────┐   │
│  │ POST /api/payments/verify               │   │
│  │ Body: {                                 │   │
│  │   razorpayOrderId,                      │   │
│  │   razorpayPaymentId,                    │   │
│  │   razorpaySignature                     │   │
│  │ }                                       │   │
│  │                                         │   │
│  │ Backend:                                │   │
│  │ ├─ Verify HMAC SHA256 signature         │   │
│  │ ├─ Update Payment status: 'completed'   │   │
│  │ ├─ Update Event:                        │   │
│  │ │  ├─ status: 'published'               │   │
│  │ │  ├─ paymentStatus: 'paid'             │   │
│  │ │  └─ isFeatured: true (if premium)    │   │
│  │ └─ Return success                       │   │
│  └─────────────────────────────────────────┘   │
│                  ↓                              │
│  Step 4: Success                               │
│  ├─ Event published & visible                  │
│  ├─ Event appears in Browse Events            │
│  └─ Organizer can receive applications        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔑 Key Implementation Details

### Event Creation Flow Decision Tree

```
Organizer clicks "Post Event"
        ↓
    Creates Event
        ↓
        ├─ Admin? 
        │  ├─ YES → status: 'published', paymentStatus: 'free'
        │  │         Return: "Event created and published immediately"
        │  │
        │  └─ NO (Organizer)
        │     └─ status: 'draft', paymentStatus: 'pending'
        │        Return: "Please complete payment to publish"
        │        Redirect: Payment Page
        │
        └─ Payment Completed?
           ├─ YES → Verify signature
           │        Update: status: 'published', paymentStatus: 'paid'
           │        Emit: Event.Published event
           │        Return success
           │
           └─ NO → Return error
                   Payment still pending
```

---

## 📈 Business Logic

```
Revenue Model:
┌────────────────────────────────────┐
│ Basic Event Posting                │
│ ₹299 per event                     │
│ ├─ 50 events/month = ₹14,950      │
│ └─ 100 events/month = ₹29,900     │
└────────────────────────────────────┘
        +
┌────────────────────────────────────┐
│ Featured Event Posting             │
│ ₹599 per event                     │
│ ├─ 20 events/month = ₹11,980      │
│ └─ 50 events/month = ₹29,950      │
└────────────────────────────────────┘
        =
   Monthly Revenue: ₹14K - ₹60K+

Future:
├─ Subscription plans (₹499/month)
├─ Premium features (₹99/event)
├─ Boost system (₹199-₹999)
└─ Commission on event revenue (5-10%)
```

---

**Last Updated:** April 8, 2026
**Status:** Production Ready ✅
