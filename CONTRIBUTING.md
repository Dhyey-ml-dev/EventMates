# Getting Started with EventMates Development

This guide will help you set up the EventMates project locally for development.

## 📋 Prerequisites

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **MongoDB**: Local or Atlas (cloud)
- **Git**: For version control

## ⚙️ Local Development Setup

### 1. Clone the Repository

```bash
cd /path/to/project
git clone <repository-url> EventMates
cd EventMates
```

### 2. Backend Setup

```bash
cd server

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

**Backend runs on:** http://localhost:5000

### 3. Frontend Setup

```bash
cd ../client

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs on:** http://localhost:5173

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

---

## 🗄️ Database Setup

### Using MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventmates
   ```

### Using Local MongoDB

```bash
# macOS (with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install -y mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
# Run installer
```

Then add to `.env`:
```
MONGODB_URI=mongodb://localhost:27017/eventmates
```

---

## 🔧 Configuration

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eventmates

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Razorpay (Optional - for testing)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional - for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_SERVICE=gmail

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Terminal 1 - Start Backend

```bash
cd server
npm run dev
```

### Terminal 2 - Start Frontend

```bash
cd client
npm run dev
```

### Check Everything is Working

1. Backend should log: ✅ MongoDB Connected
2. Frontend should be accessible at http://localhost:5173
3. Try signing up as a student or organizer

---

## 📁 Project Structure

```
EventMates/
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── utils/          # Helper functions
│   │   ├── config/         # Configuration
│   │   └── server.js       # Main server file
│   ├── package.json
│   └── .env                # Environment variables
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # API calls
│   │   ├── store/          # Redux state
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities
│   │   ├── hooks/          # Custom hooks
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── .env                # Environment variables
│
├── README.md               # Project documentation
└── DEPLOYMENT.md           # Deployment guide
```

---

## 🧪 Testing the API

### Using cURL or Postman

#### Register

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

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

#### Get Events

```bash
curl http://localhost:5000/api/events?status=published
```

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Make sure MongoDB is running
2. Check your connection string in `.env`
3. If using Atlas, whitelist your IP

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Kill the process using the port
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows (find PID)
taskkill /PID <PID> /F         # Windows (kill process)
```

### CORS Errors

**Solution:** Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 💻 Development Workflow

### Creating a New Feature

1. Create a branch:
   ```bash
   git checkout -b feature/feature-name
   ```

2. Make changes to backend and/or frontend

3. Test locally

4. Commit changes:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. Push and create pull request:
   ```bash
   git push origin feature/feature-name
   ```

### Code Style

- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Follow existing code patterns

---

## 📚 API Documentation

### Authentication Routes

```
POST   /api/auth/signup           - Register new user
POST   /api/auth/login            - Login user
POST   /api/auth/refresh-token    - Refresh access token
GET    /api/auth/me               - Get current user
POST   /api/auth/logout           - Logout user
```

### Event Routes

```
GET    /api/events                - Get all events
GET    /api/events/:eventId       - Get event details
POST   /api/events                - Create event (organizer)
PUT    /api/events/:eventId       - Update event
DELETE /api/events/:eventId       - Delete event
```

### Application Routes

```
POST   /api/applications/:eventId/apply         - Apply to event
GET    /api/applications/my-applications        - Get my applications
PATCH  /api/applications/:applicationId/status  - Update status
```

### User Routes

```
PUT    /api/users/profile         - Update profile
POST   /api/users/profile-photo   - Upload photo
GET    /api/users/profile/:userId - Get user profile
```

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Submit a pull request

---

## 📞 Getting Help

- Check existing issues on GitHub
- Read the documentation
- Ask in discussions
- Check error logs

---

## 🎯 Next Steps

- [ ] Set up local development environment
- [ ] Create test user accounts
- [ ] Explore the codebase
- [ ] Try creating events and applying
- [ ] Test the dashboard features
- [ ] Read API documentation
- [ ] Make your first contribution

---

Happy Coding! 🚀
