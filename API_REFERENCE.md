# 🔌 EVENTMATES ADMIN API - QUICK REFERENCE

**All endpoints require:** `Authorization: Bearer <JWT_TOKEN>` header + `role: 'admin'`

---

## Authentication

### Admin Login (Public - No Auth Required)
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@eventmates.com",
  "password": "Admin@123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "admin": {
      "_id": "admin_id",
      "email": "admin@eventmates.com",
      "name": "John Doe",
      "role": "admin"
    }
  }
}
```

---

## Dashboard

### Get Dashboard Statistics
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1250,
      "totalEvents": 380,
      "totalRevenue": 250000,
      "pendingVerifications": 28,
      "platformRating": 4.7
    },
    "charts": {
      "revenue": [...],
      "userGrowth": [...]
    }
  }
}
```

---

## Event Management

### List All Events
```http
GET /api/admin/events?status=published&page=1&limit=20&search=tech
Authorization: Bearer <TOKEN>
```

**Query Parameters:**
- `status` - Filter by event status
- `location` - Filter by location
- `page` - Page number
- `limit` - Items per page
- `search` - Search term

### Create Event
```http
POST /api/admin/events/create
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Tech Conference 2026",
  "description": "Annual tech conference",
  "location": "Mumbai",
  "eventDate": "2026-05-15",
  "eventEndDate": "2026-05-16",
  "startTime": "09:00",
  "endTime": "18:00",
  "category": "Technology",
  "pay": {
    "amount": 500,
    "currency": "INR",
    "paymentType": "fixed"
  },
  "maxApplicants": 100,
  "roles": [
    {"title": "Volunteer", "count": 20}
  ]
}
```

### Update Event
```http
PATCH /api/admin/events/:eventId/update
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "location": "Delhi",
  "pay": {"amount": 600, "currency": "INR"},
  "status": "published"
}
```

### Delete Event
```http
DELETE /api/admin/events/:eventId/delete
Authorization: Bearer <TOKEN>
```

---

## Volunteer Management

### List All Volunteers
```http
GET /api/admin/volunteers?verified=true&page=1&limit=20
Authorization: Bearer <TOKEN>
```

**Query Parameters:**
- `verified` - Filter by verification status
- `blocked` - Filter by blocked status
- `page` - Page number
- `limit` - Items per page

### Verify Volunteer
```http
PATCH /api/admin/volunteers/:volunteerId/verify
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "verified": true
}
```

### Remove Volunteer
```http
DELETE /api/admin/volunteers/:volunteerId/remove
Authorization: Bearer <TOKEN>
```

---

## User Management

### List All Users
```http
GET /api/admin/users?role=student&status=active&page=1&limit=20
Authorization: Bearer <TOKEN>
```

**Query Parameters:**
- `role` - Filter by role (student/organizer)
- `status` - Filter by status (active/blocked)
- `page` - Page number
- `limit` - Items per page

### Block User
```http
PATCH /api/admin/users/:userId/block
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "reason": "Suspicious activity detected"
}
```

### Reset User Password
```http
PATCH /api/admin/users/:userId/reset-password
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "newPassword": "TempPassword123"
}
```

---

## Payment Management

### Get All Payments
```http
GET /api/admin/payments?eventId=event123&page=1&limit=20
Authorization: Bearer <TOKEN>
```

**Query Parameters:**
- `eventId` - Filter by event
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": [...],
  "analytics": {
    "totalRevenue": 250000,
    "totalTransactions": 150,
    "completedTransactions": 148
  }
}
```

### Process Refund
```http
POST /api/admin/payments/:paymentId/refund
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "reason": "User requested cancellation"
}
```

---

## Notifications & Broadcast

### Send Broadcast Message
```http
POST /api/admin/broadcast
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "target": "all|volunteers|organizers",
  "title": "Important Update",
  "message": "We are excited to announce..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "target": "all",
    "title": "Important Update",
    "sentAt": "2026-04-07T10:30:00Z",
    "sentBy": "admin@eventmates.com"
  }
}
```

---

## Activity Logs

### Get Activity Logs
```http
GET /api/admin/logs?action=CREATE_EVENT&page=1&limit=50
Authorization: Bearer <TOKEN>
```

**Query Parameters:**
- `action` - Filter by action type
- `admin` - Filter by admin email
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "log_id",
      "adminId": "admin_id",
      "adminEmail": "admin@eventmates.com",
      "action": "CREATE_EVENT",
      "details": "Created event: Tech Conference",
      "timestamp": "2026-04-07T10:30:00Z",
      "ipAddress": "192.168.1.1"
    }
  ]
}
```

---

## Settings

### Get System Settings
```http
GET /api/admin/settings
Authorization: Bearer <TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "platformName": "EventMates",
    "adminEmail": "admin@eventmates.com",
    "maintenanceMode": false,
    "emailNotifications": true,
    "maxEventsPerOrganizer": 50,
    "minVolunteerRating": 3.0,
    "autoApproveEvents": false,
    "requireEventVerification": true
  }
}
```

### Update Setting
```http
PATCH /api/admin/settings/update
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "setting": "maintenanceMode",
  "value": true
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid admin credentials"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin role required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Failed to process request",
  "error": "Error details..."
}
```

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Headers Required

**All Protected Endpoints:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Storage:**
```javascript
// After successful login
localStorage.setItem('adminToken', data.data.token);
localStorage.setItem('adminRefreshToken', data.data.refreshToken);
```

---

## Base URL

**Local Development:** `http://localhost:5001/api`  
**Production:** `https://your-domain.com/api`

---

**Last Updated:** April 7, 2026  
**API Version:** 1.0
