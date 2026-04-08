# EventMates API Testing Guide

This document provides examples for testing the EventMates API using curl or Postman.

## 🔐 Authentication

### 1. Sign Up

**Endpoint:** `POST /api/auth/signup`

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh Token

**Endpoint:** `POST /api/auth/refresh-token`

```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 5. Logout

**Endpoint:** `POST /api/auth/logout`

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 👤 User Profile

### Update Profile

**Endpoint:** `PUT /api/users/profile`

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+91-9999999999",
    "college": "IIT Delhi",
    "skills": ["Event Planning", "Photography", "Marketing"],
    "experience": "2 years"
  }'
```

### Get User Profile

**Endpoint:** `GET /api/users/profile/:userId`

```bash
curl -X GET http://localhost:5000/api/users/profile/USER_ID
```

---

## 🎯 Events

### Create Event

**Endpoint:** `POST /api/events`

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2024",
    "description": "A comprehensive tech conference covering latest trends in web development, AI, and cloud computing.",
    "location": "New Delhi, India",
    "eventDate": "2024-05-15T09:00:00Z",
    "eventEndDate": "2024-05-15T17:00:00Z",
    "startTime": "09:00",
    "endTime": "17:00",
    "roles": [
      {
        "title": "Event Coordinator",
        "count": 2,
        "description": "Manage event flow and coordinate with speakers"
      },
      {
        "title": "Tech Support",
        "count": 3,
        "description": "Handle technical setup and troubleshooting"
      }
    ],
    "pay": {
      "amount": 5000,
      "paymentType": "fixed"
    },
    "requirements": [
      "Must be a college student",
      "Should have event management experience",
      "Excellent communication skills"
    ],
    "category": "Technology"
  }'
```

### Get All Events

**Endpoint:** `GET /api/events`

```bash
# Get all published events
curl http://localhost:5000/api/events?status=published

# With filters
curl "http://localhost:5000/api/events?status=published&location=Delhi&minPay=5000&maxPay=15000&page=1&limit=12"

# With search
curl "http://localhost:5000/api/events?search=conference&status=published"
```

### Get Event Details

**Endpoint:** `GET /api/events/:eventId`

```bash
curl http://localhost:5000/api/events/EVENT_ID
```

### Update Event

**Endpoint:** `PUT /api/events/:eventId`

```bash
curl -X PUT http://localhost:5000/api/events/EVENT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Event Title",
    "description": "Updated description",
    "location": "New Location"
  }'
```

### Publish Event

**Endpoint:** `PATCH /api/events/:eventId/publish`

```bash
curl -X PATCH http://localhost:5000/api/events/EVENT_ID/publish \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Event

**Endpoint:** `DELETE /api/events/:eventId`

```bash
curl -X DELETE http://localhost:5000/api/events/EVENT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📋 Applications

### Apply to Event

**Endpoint:** `POST /api/applications/:eventId/apply`

```bash
curl -X POST http://localhost:5000/api/applications/EVENT_ID/apply \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "applicationMessage": "I am interested in this event and have 2 years of experience in event management."
  }'
```

### Get My Applications (Student)

**Endpoint:** `GET /api/applications/my-applications`

```bash
curl http://localhost:5000/api/applications/my-applications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With filters
curl "http://localhost:5000/api/applications/my-applications?status=selected&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Event Applicants (Organizer)

**Endpoint:** `GET /api/applications/event/:eventId/applicants`

```bash
curl http://localhost:5000/api/applications/event/EVENT_ID/applicants \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Application Status

**Endpoint:** `PATCH /api/applications/:applicationId/status`

```bash
# Shortlist
curl -X PATCH http://localhost:5000/api/applications/APPLICATION_ID/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shortlisted"
  }'

# Select
curl -X PATCH http://localhost:5000/api/applications/APPLICATION_ID/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "selected"
  }'

# Reject
curl -X PATCH http://localhost:5000/api/applications/APPLICATION_ID/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "rejectionReason": "Not a good fit for this role"
  }'
```

### Cancel Application

**Endpoint:** `DELETE /api/applications/:applicationId/cancel`

```bash
curl -X DELETE http://localhost:5000/api/applications/APPLICATION_ID/cancel \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ⭐ Reviews & Ratings

### Create Review

**Endpoint:** `POST /api/reviews`

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "USER_ID",
    "eventId": "EVENT_ID",
    "applicationId": "APPLICATION_ID",
    "rating": 5,
    "title": "Excellent Experience",
    "comment": "John was professional, punctual, and very helpful. Highly recommend!"
  }'
```

### Get User Reviews

**Endpoint:** `GET /api/reviews/user/:userId`

```bash
curl http://localhost:5000/api/reviews/user/USER_ID?page=1&limit=10
```

### Delete Review

**Endpoint:** `DELETE /api/reviews/:reviewId`

```bash
curl -X DELETE http://localhost:5000/api/reviews/REVIEW_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 💳 Payments

### Initiate Payment

**Endpoint:** `POST /api/payments/initiate`

```bash
curl -X POST http://localhost:5000/api/payments/initiate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentType": "event-posting",
    "eventId": "EVENT_ID",
    "description": "Event posting fee for Tech Conference"
  }'
```

### Verify Payment

**Endpoint:** `POST /api/payments/verify`

```bash
curl -X POST http://localhost:5000/api/payments/verify \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpayOrderId": "order_123",
    "razorpayPaymentId": "pay_123",
    "razorpaySignature": "signature_123"
  }'
```

### Get Payment History

**Endpoint:** `GET /api/payments/history`

```bash
curl http://localhost:5000/api/payments/history \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With filters
curl "http://localhost:5000/api/payments/history?status=completed&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔔 Notifications

### Get Notifications

**Endpoint:** `GET /api/notifications`

```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread only
curl "http://localhost:5000/api/notifications?isRead=false" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mark as Read

**Endpoint:** `PATCH /api/notifications/:notificationId/read`

```bash
curl -X PATCH http://localhost:5000/api/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mark All as Read

**Endpoint:** `PATCH /api/notifications/read-all`

```bash
curl -X PATCH http://localhost:5000/api/notifications/read-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Test Scenarios

### Scenario 1: Complete User Flow

1. Sign up as a student
2. Update profile with college and skills
3. Browse events
4. Apply to an event
5. Get application status
6. Wait for organizer decision

### Scenario 2: Organizer Flow

1. Sign up as an organizer
2. Update company profile
3. Create and publish an event
4. View applicants
5. Shortlist candidates
6. Select final volunteers
7. Create payment for event posting

### Scenario 3: Rating Flow

1. Complete an event (as both student and organizer)
2. Create mutual reviews
3. Verify ratings updated on profiles

---

## 🐛 Common Test Cases

### Error Handling

```bash
# Invalid email
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid", "password": "pass"}'

# Missing required field
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Event"}'

# Unauthorized access
curl http://localhost:5000/api/events/EVENT_ID/applicants
```

---

## 💡 Tips

1. Save tokens in environment variables:
   ```bash
   TOKEN="your_access_token"
   curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/me
   ```

2. Use Postman for easier testing
3. Check response status codes
4. Validate error messages
5. Test with different user roles

---

**Happy Testing! 🎉**
