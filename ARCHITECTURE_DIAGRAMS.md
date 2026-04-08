# 🎨 EventMates Event System - Visual Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EventMates Platform                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      CLIENT (Frontend)                        │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │                                                                │   │
│  │  Homepage              BrowseEventsPage    EventDetailsPage  │   │
│  │  ├─ Featured Events    ├─ Event Cards      ├─ Full Details   │   │
│  │  ├─ Sample Events      ├─ Filters          ├─ Apply Button   │   │
│  │  └─ Hero Image         └─ Pagination       └─ Reviews        │   │
│  │                                                                │   │
│  │  PostEventPage         EventPostingPaymentPage  AdminDash   │   │
│  │  ├─ Event Form         ├─ Plan Selector       ├─ Create Event │   │
│  │  ├─ Submit → Payment   ├─ Razorpay Checkout   ├─ Manage Events│   │
│  │  └─ Upload Image       └─ Success Redirect    └─ View Analytics│   │
│  │                                                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                  ↕️                                   │
│                           HTTP/REST API                              │
│                                  ↕️                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      SERVER (Backend)                         │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │                                                                │   │
│  │  Event Routes           Payment Routes      Auth Routes      │   │
│  │  ├─ GET /events         ├─ POST /initiate   ├─ POST /login    │   │
│  │  ├─ POST /events        ├─ POST /verify     ├─ POST /signup   │   │
│  │  ├─ PUT /events/:id     ├─ GET /history     └─ POST /logout   │   │
│  │  ├─ PATCH /publish      └─ POST /refund                      │   │
│  │  └─ DELETE /events/:id                                       │   │
│  │                                                                │   │
│  │  Event Controller       Payment Controller  Auth Controller  │   │
│  │  ├─ createEvent()       ├─ initiatePayment()  ├─ register()   │   │
│  │  ├─ updateEvent()       ├─ verifyPayment()    ├─ login()      │   │
│  │  ├─ publishEvent()      ├─ refundPayment()    └─ getCurrentUser│   │
│  │  └─ deleteEvent()       └─ getHistory()                      │   │
│  │                                                                │   │
│  │  Seed Function (seedSampleEvents)                           │   │
│  │  ├─ Check if samples exist                                   │   │
│  │  ├─ Insert 8 Ahmedabad events                                │   │
│  │  └─ Mark as isSample: true                                   │   │
│  │                                                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                  ↕️                                   │
│                           MongoDB/Database                           │
│                                  ↕️                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    DATA LAYER                                │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │                                                                │   │
│  │  Event Model              Payment Model        User Model    │   │
│  │  ├─ title                 ├─ organizerId       ├─ email      │   │
│  │  ├─ description           ├─ eventId           ├─ password   │   │
│  │  ├─ location              ├─ amount            ├─ role       │   │
│  │  ├─ pay                   ├─ paymentStatus     └─ profile    │   │
│  │  ├─ roles                 ├─ razorpayOrderId                 │   │
│  │  ├─ status                ├─ razorpayPaymentId               │   │
│  │  ├─ paymentStatus   ✨    └─ razorpaySignature               │   │
│  │  ├─ createdByRole   ✨                                        │   │
│  │  ├─ isSample        ✨                                        │   │
│  │  ├─ isFeatured            Application Model                  │   │
│  │  └─ isVerified            ├─ studentId                       │   │
│  │                            ├─ eventId                        │   │
│  │                            ├─ status                         │   │
│  │                            └─ appliedDate                    │   │
│  │                                                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌────────────────────────────┬────────────────────────────────┐   │
│  │   EXTERNAL SERVICES        │    THIRD-PARTY INTEGRATIONS    │   │
│  ├────────────────────────────┼────────────────────────────────┤   │
│  │                            │                                │   │
│  │  Razorpay Payment Gateway  │  Unsplash Image API           │   │
│  │  ├─ Create Order           │  ├─ High-quality images       │   │
│  │  ├─ Verify Signature       │  ├─ Free images              │   │
│  │  ├─ Process Payment        │  └─ Optimized URLs           │   │
│  │  └─ Refund                 │                               │   │
│  │                            │  JWT Authentication           │   │
│  │  MongoDB Atlas             │  ├─ Token signing            │   │
│  │  ├─ Cloud database         │  ├─ Token verification       │   │
│  │  ├─ Backups               │  └─ Role-based access        │   │
│  │  └─ Monitoring            │                               │   │
│  │                            │                               │   │
│  └────────────────────────────┴────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

✨ = NEW FIELDS added for monetization system

---

## Event Lifecycle Diagram

### Admin Event (Free)
```
┌──────────────────────────────────────────────┐
│  Admin Creates Event (AdminDashboard Modal)  │
└────────────────┬─────────────────────────────┘
                 │
                 ↓
    ┌────────────────────────────┐
    │ Event Created with:        │
    │ ├─ status: "published"     │
    │ ├─ paymentStatus: "free"   │
    │ └─ createdByRole: "admin"  │
    └────────────┬───────────────┘
                 │
                 ↓
    ┌────────────────────────────┐
    │ ✅ Event Published!        │
    │ Visible to all users       │
    │ Appears on website         │
    └────────────────────────────┘
```

### Organizer Event (Paid)
```
┌────────────────────────────────────────────────────┐
│  Organizer Fills Event Form (/organizer/post-event)│
└─────────────────────┬──────────────────────────────┘
                      │
                      ↓
         ┌────────────────────────────┐
         │ Submit Event Form          │
         │ Backend: Create Draft Event│
         │ ├─ status: "draft"         │
         │ ├─ paymentStatus: "pending"│
         │ └─ createdByRole: "organizer"
         └────────────┬───────────────┘
                      │
                      ↓
        ┌─────────────────────────────────┐
        │ Redirect to Payment Page         │
        │ (/payment/event-posting)        │
        └────────────┬────────────────────┘
                     │
                     ↓
      ┌──────────────────────────────────┐
      │ Select Plan:                     │
      │ ├─ Basic: ₹299 (30 days)        │
      │ └─ Featured: ₹599 (30 days +⭐) │
      └────────────┬─────────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │ Click "Pay ₹299/₹599"            │
    └────────────┬─────────────────────┘
                 │
                 ↓
      ┌──────────────────────────────┐
      │ Razorpay Checkout Opens      │
      │ User enters payment details  │
      └────────────┬─────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────────┐
    │         Payment Processing            │
    │   (Razorpay handles encryption)      │
    └────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ↓                 ↓
    ✅ SUCCESS         ❌ FAILED
        │                 │
        ↓                 ↓
   Update Event:    Event stays in draft
   ├─ status:       User redirected back
   │  "published"   Can retry payment
   ├─ payment:
   │  "paid"
   └─ featured: true (if premium)
        │
        ↓
    Backend sends confirmation
        │
        ↓
    Frontend redirects to
    /events/:eventId (success page)
        │
        ↓
    ✅ Event Published!
    ✅ Visible to all users
    ✅ Can receive applications
```

---

## Data Flow Diagram

```
USER INTERACTIONS
├─ Browse Events
│  └─> GET /api/events
│      └─> Backend fetches from MongoDB
│          └─> Returns events array
│              └─> Display on BrowseEventsPage
│                  ├─ Show Event Cards
│                  ├─ Apply Filters
│                  └─ Paginate results
│
├─ View Event Details
│  └─> GET /api/events/:eventId
│      └─> Returns event + applicants count
│          └─ Display full details
│
├─ Admin Creates Event
│  └─> POST /api/events (admin role)
│      └─> Server:
│          ├─ Validate input
│          ├─ Create with status="published"
│          ├─ Create with paymentStatus="free"
│          └─> Save to MongoDB
│              └─ Return event data
│                 └─ Show confirmation
│
└─ Organizer Posts Paid Event
   └─> Step 1: Create Draft
       └─> POST /api/events (organizer role)
           ├─ Creates event with status="draft"
           ├─ Creates event with paymentStatus="pending"
           └─> Save to MongoDB
   
   └─> Step 2: Initiate Payment
       └─> POST /api/payments/events/initiate-event-posting
           ├─ Create Razorpay order
           ├─ Link to event ID
           ├─ Save payment record
           └─> Return order details
   
   └─> Step 3: Process Payment
       └─> Frontend: Razorpay checkout
           ├─ Collect card details
           ├─ Process via Razorpay servers
           └─> Return payment result
   
   └─> Step 4: Verify Payment
       └─> POST /api/payments/verify
           ├─ Verify Razorpay signature
           ├─ Check payment legitimacy
           ├─ Update payment record: "completed"
           └─> Update event:
               ├─ status: "published"
               ├─ paymentStatus: "paid"
               └─ isFeatured: true (if premium)
               
           └─> Save to MongoDB
               └─> Return success
                   └─ Frontend redirects to event page
                      └─ ✅ Event now live!
```

---

## Database Schema Relationships

```
┌──────────────┐
│    User      │
├──────────────┤
│ _id (PK)     │──┐
│ email        │  │
│ password     │  │
│ role         │  │ (admin/organizer/student)
│ firstName    │  │
│ lastName     │  │
│ phone        │  │
└──────────────┘  │
                  │
          ┌───────┼────────────────────────────┐
          │       │                            │
          ↓       ↓                            ↓
    ┌──────────┐ ┌──────────────┐  ┌──────────────┐
    │  Event   │ │  Application │  │   Payment    │
    ├──────────┤ ├──────────────┤  ├──────────────┤
    │ _id (PK) │ │ _id (PK)     │  │ _id (PK)     │
    │organizer │ │ studentId(FK)│  │organizerId(FK)
    │Id(FK)  ←─┼─┤ eventId(FK)←─┼──┤ eventId(FK)  │
    │ title    │ │ status       │  │ amount       │
    │location  │ │ appliedDate  │  │paymentStatus │
    │pay       │ └──────────────┘  │razorpayOrder │
    │eventDate │                   │razorpayPayId │
    │roles     │  ┌──────────────┐ │razorpaySign  │
    │status    │  │   Review     │ └──────────────┘
    │payment   │  ├──────────────┤
    │Status ✨ │  │ _id (PK)     │
    │created   │  │ eventId(FK)  │
    │ByRole ✨ │  │ studentId(FK)│
    │isSample✨│  │ rating       │
    │featured  │  │ comment      │
    │verified  │  └──────────────┘
    └──────────┘

PK = Primary Key
FK = Foreign Key
✨ = New fields for monetization

```

---

## API Endpoint Hierarchy

```
/api
├─ /auth
│  ├─ POST /login
│  ├─ POST /signup
│  └─ POST /logout
│
├─ /users
│  ├─ GET /:userId
│  ├─ PUT /:userId
│  └─ GET /search
│
├─ /events                          (Event Management)
│  ├─ GET /                         (Get all - public)
│  ├─ POST /                        (Create - auth required)
│  │   ├─ Admin: publish immediately
│  │   └─ Organizer: create draft for payment
│  │
│  ├─ GET /:eventId                (Get single - public)
│  ├─ PUT /:eventId                (Update - owner only)
│  ├─ DELETE /:eventId             (Delete - owner only)
│  │
│  ├─ PATCH /:eventId/publish      (Publish - organizer)
│  ├─ PATCH /:eventId/publish-after-payment (After payment)
│  │
│  └─ GET /organizer/my-events     (Organizer's events)
│
├─ /payments                        (Payment Processing)
│  ├─ POST /initiate               (General payment)
│  ├─ POST /verify                 (Verify Razorpay signature)
│  ├─ GET /history                 (Payment history)
│  ├─ POST /:paymentId/refund      (Refund)
│  │
│  └─ POST /events/initiate-event-posting ✨ (Event posting fee)
│
├─ /applications
│  ├─ POST /                        (Apply for event)
│  ├─ GET /:eventId                (Get applicants)
│  ├─ PATCH /:applicationId/accept (Accept volunteer)
│  └─ PATCH /:applicationId/reject (Reject volunteer)
│
├─ /reviews
│  ├─ POST /                        (Post review)
│  ├─ GET /:eventId                (Get reviews)
│  └─ DELETE /:reviewId            (Delete review)
│
└─ /notifications
   ├─ GET /                         (Get notifications)
   ├─ PATCH /:notificationId/read   (Mark as read)
   └─ DELETE /:notificationId       (Delete notification)
```

✨ = New endpoint for monetization

---

## User Journey Maps

### Student User
```
Homepage
   ↓
See Sample Events (8 pre-seeded)
   ↓
Click "Browse Events"
   ↓
BrowseEventsPage: Filter by location/pay
   ↓
Click "View Details" on event
   ↓
EventDetailsPage: See full description
   ↓
Click "Apply"
   ↓
Get Confirmation
   ↓
Check "Dashboard/Student" for status
   ↓
Get selected → Check payment page
```

### Organizer User (Paid)
```
Login as Organizer
   ↓
Click "Post Event"
   ↓
/organizer/post-event: Fill form
   ├─ Title, description, location
   ├─ Date, time, pay amount
   ├─ Roles needed
   └─ Upload image URL
   ↓
Click "Post Event"
   ↓
Redirect to /payment/event-posting
   ↓
Select Plan:
├─ Basic ₹299 (30 days)
└─ Featured ₹599 (30 days + ⭐)
   ↓
Click "Pay ₹XXX"
   ↓
Razorpay Checkout
├─ Enter card details
├─ Complete payment
└─ Verify OTP (if needed)
   ↓
Success Page
   ↓
Redirect to /events/:eventId
   ↓
✅ Event Published!
   ↓
Start receiving applications
```

### Admin User
```
Login at /admin/login
   ↓
AdminDashboard page loads
   ↓
Click "Create Event" button
   ↓
Modal opens: Event form
├─ Title, description, location
├─ Date, time, pay amount
├─ Roles needed
└─ Featured checkbox
   ↓
Click "Create & Publish Event"
   ↓
✅ Event published instantly
   ↓
Visible on website immediately
   ↓
No payment required
```

---

## Component Tree

```
App
├─ Navbar
│  ├─ Logo (redirect to /)
│  ├─ Navigation Links (Home, Events, About)
│  ├─ Auth Section (Login/Signup or Dashboard/Logout)
│  └─ Mobile Menu (Hamburger)
│
├─ Routes
│  ├─ HomePage
│  │  ├─ Hero Section
│  │  ├─ Featured Events Grid
│  │  │  └─ EventCard[] (Sample Events)
│  │  ├─ Why Section
│  │  ├─ How Section
│  │  └─ CTA Buttons
│  │
│  ├─ BrowseEventsPage
│  │  ├─ Hero Section
│  │  ├─ Filter Panel
│  │  │  ├─ Search Input
│  │  │  ├─ Location Filter
│  │  │  ├─ Min Pay
│  │  │  └─ Max Pay
│  │  ├─ EventCard Grid
│  │  └─ Pagination
│  │
│  ├─ EventDetailsPage
│  │  ├─ Large Image
│  │  ├─ Event Title
│  │  ├─ Description
│  │  ├─ Pay & Roles
│  │  ├─ Apply Button
│  │  └─ Reviews Section
│  │
│  ├─ PostEventPage (Organizer)
│  │  ├─ Event Form ✨ (MODIFIED)
│  │  │  ├─ Title, Description
│  │  │  ├─ Location
│  │  │  ├─ Date/Time
│  │  │  ├─ Pay Amount
│  │  │  ├─ Roles Manager
│  │  │  └─ Requirements Manager
│  │  └─ Submit Button → Payment
│  │
│  ├─ EventPostingPaymentPage ✨ (NEW)
│  │  ├─ Plan Selector
│  │  │  ├─ Basic Plan Card (₹299)
│  │  │  └─ Featured Plan Card (₹599)
│  │  ├─ Order Summary
│  │  └─ Razorpay Checkout Button
│  │
│  ├─ AdminDashboard
│  │  ├─ Overview Stats
│  │  ├─ Create Event Modal
│  │  ├─ Events Tab
│  │  ├─ Users Tab
│  │  ├─ Analytics Tab
│  │  └─ Settings
│  │
│  ├─ AdminEventManagement ✨ (NEW)
│  │  └─ Event Creation Form
│  │     ├─ All Event Fields
│  │     ├─ Image URL
│  │     ├─ Featured Toggle
│  │     └─ Submit (Direct Publish)
│  │
│  └─ AboutPage
│     ├─ Mission Section
│     ├─ Team Section
│     └─ Contact Form
│
├─ Footer
│  ├─ Links
│  ├─ Social Media
│  └─ Copyright
│
└─ Toast Notifications (react-hot-toast)
```

✨ = New or significantly modified

---

## State Management (Redux)

```
Store
├─ auth
│  ├─ isAuthenticated: boolean
│  ├─ user: {...}
│  │  ├─ userId
│  │  ├─ email
│  │  ├─ role (student/organizer/admin)
│  │  └─ profile
│  └─ token: string
│
├─ event
│  ├─ events: Event[]
│  │  └─ Each Event:
│  │     ├─ _id
│  │     ├─ title
│  │     ├─ status (draft/published/...)
│  │     ├─ paymentStatus ✨ (pending/paid/free)
│  │     ├─ createdByRole ✨ (admin/organizer)
│  │     ├─ isSample ✨ (true/false)
│  │     ├─ isFeatured
│  │     └─ ...
│  │
│  ├─ pagination
│  │  ├─ total
│  │  ├─ pages
│  │  ├─ currentPage
│  │  └─ limit
│  │
│  └─ isLoading: boolean
│
└─ payment
   ├─ payments: Payment[]
   ├─ currentOrder: {...}
   │  ├─ orderId
   │  ├─ amount
   │  └─ status
   └─ isProcessing: boolean
```

✨ = New fields for monetization

---

**Diagram Version:** 1.0
**Last Updated:** April 7, 2026
**Status:** Complete
