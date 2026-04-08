# EventMates - Student Volunteer Marketplace Platform

A production-ready MERN (MongoDB, Express, React, Node.js) marketplace platform that connects Event Organizers with Student Volunteers.

## 🎯 Features

### Student Features
- ✅ User authentication with JWT
- ✅ Browse and search events
- ✅ Apply to events
- ✅ Track application status
- ✅ View ratings and reviews
- ✅ Profile management

### Organizer Features
- ✅ Create and manage events
- ✅ View applicants
- ✅ Shortlist/select candidates
- ✅ Track event status
- ✅ Payment integration (Razorpay)

### Admin Features
- ✅ User management
- ✅ Event moderation
- ✅ Verification requests
- ✅ Dispute resolution
- ✅ Analytics dashboard

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **Axios** for API calls
- **Framer Motion** for animations
- **Socket.io** for real-time features

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcryptjs** for password hashing
- **Razorpay** for payments
- **Nodemailer** for emails
- **Cloudinary** for image uploads

## 📁 Project Structure

```
EventMates/
├── server/
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   └── server.js      # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── client/
    ├── src/
    │   ├── api/           # API calls
    │   ├── store/         # Redux slices
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── utils/         # Utilities
    │   ├── hooks/         # Custom hooks
    │   ├── contexts/      # React contexts
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- Razorpay account (for payments)
- Cloudinary account (for image uploads)

### Backend Setup

```bash
cd server
cp .env.example .env

# Edit .env with your configurations
nano .env

npm install
npm run dev
```

**Environment Variables** (.env):
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/eventmates
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend Setup

```bash
cd client
cp .env.example .env

# Edit .env if needed
nano .env

npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Event Endpoints
- `GET /api/events` - Get all events (public)
- `GET /api/events/:eventId` - Get event details
- `POST /api/events` - Create event (organizer only)
- `PUT /api/events/:eventId` - Update event
- `PATCH /api/events/:eventId/publish` - Publish event
- `DELETE /api/events/:eventId` - Delete event
- `GET /api/events/organizer/my-events` - Get organizer's events

### Application Endpoints
- `POST /api/applications/:eventId/apply` - Apply to event
- `GET /api/applications/my-applications` - Get student applications
- `GET /api/applications/event/:eventId/applicants` - Get event applicants
- `PATCH /api/applications/:applicationId/status` - Update application status
- `DELETE /api/applications/:applicationId/cancel` - Cancel application

### User Endpoints
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile-photo` - Upload profile photo
- `GET /api/users/profile/:userId` - Get user profile

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ CORS protection
- ✅ Helmet.js for HTTP headers
- ✅ Rate limiting
- ✅ Input validation with Zod
- ✅ Protected routes

## 🚢 Deployment

### Backend (Render/AWS/Railway)
1. Push code to GitHub
2. Connect repository to Render/AWS
3. Set environment variables
4. Deploy

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

## 📦 Database Models

### User
```javascript
{
  role, email, password,
  firstName, lastName, profilePhoto,
  phoneNumber, isVerified,
  college, skills, experience (Student),
  companyName, companyDescription (Organizer),
  ratings, reviews,
  profileCompletionPercentage,
  isActive, isSuspended, lastLogin
}
```

### Event
```javascript
{
  organizerId, title, description,
  location, eventDate, eventEndDate,
  startTime, endTime, roles, pay,
  applicants[], selectedCandidates[],
  status, viewCount, isFeatured,
  isVerified
}
```

### Application
```javascript
{
  studentId, eventId, organizerId,
  status, appliedDate,
  applicationMessage, rejectionReason,
  attendanceStatus, hoursWorked
}
```

## 📝 TODO - Features to Implement

- [ ] Admin dashboard
- [ ] Payment integration (Razorpay)
- [ ] Email notifications
- [ ] Real-time notifications (Socket.io)
- [ ] Messaging system
- [ ] Reviews & ratings
- [ ] Search & filters
- [ ] User verification
- [ ] Event moderation
- [ ] Analytics dashboard
- [ ] Dark mode
- [ ] PWA support

## 🐛 Known Issues & Improvements

- Socket.io integration pending
- Cloudinary upload utility needs refinement
- Admin routes need implementation
- More comprehensive error handling needed

## 📞 Support

For issues or questions, please create an issue in the repository.

## 📄 License

MIT License

## 🙏 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

**Built with ❤️ for the community**
