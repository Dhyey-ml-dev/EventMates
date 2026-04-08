# EventMates Deployment Guide

## Prerequisites

- Node.js v16+
- MongoDB Atlas account (or local MongoDB)
- Razorpay account
- Cloudinary account
- Nodemailer (Gmail with app password)
- Git

---

## 🖥️ Backend Deployment (Render/Railway/AWS)

### Option 1: Render (Recommended for beginners)

1. **Create Render Account**
   - Sign up at https://render.com

2. **Create Web Service**
   - Connect GitHub repository
   - Select `server` directory
   - Set Environment:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=generate_a_random_secret
     JWT_REFRESH_SECRET=generate_another_random_secret
     RAZORPAY_KEY_ID=your_key
     RAZORPAY_KEY_SECRET=your_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_secret
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```

3. **Deploy**
   - Set Start Command: `npm install && npm start`
   - Click Deploy

### Option 2: Railway

1. Create project on Railway
2. Connect GitHub repo
3. Add MongoDB plugin
4. Set environment variables
5. Deploy

### Option 3: AWS EC2

1. Create EC2 instance (Ubuntu 22.04)
2. Install Node.js and MongoDB
3. Clone repository
4. Run:
   ```bash
   cd server
   npm install
   pm2 start src/server.js --name eventmates-api
   ```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

```bash
cd client

# Update vite.config.js for production
# Set VITE_API_URL to your backend URL
```

Update `.env.production`:
```
VITE_API_URL=https://your-backend-api.onrender.com/api
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use GitHub integration:
1. Go to vercel.com
2. Import GitHub repo
3. Set root directory: `client`
4. Add environment variable `VITE_API_URL`
5. Deploy

---

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Add IP whitelist (or allow all for testing)
4. Create user with password
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/eventmates`

### Local MongoDB

```bash
# macOS (with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Download MongoDB installer from https://www.mongodb.com/try/download/community
```

---

## 💳 Payment Integration (Razorpay)

1. Create account at https://dashboard.razorpay.com
2. Get API keys from Settings → API Keys
3. Add to environment variables

**Test Credentials:**
- Card: 4111 1111 1111 1111
- Expiry: 12/25
- CVV: 123

---

## 📧 Email Setup (Nodemailer)

### Gmail Setup

1. Enable 2-step verification on Gmail
2. Create App Password: https://myaccount.google.com/apppasswords
3. Use this password in `.env`

### Other Email Services

Update `src/config/email.js`:
```javascript
const transporter = nodemailer.createTransport({
  service: 'your-service', // gmail, outlook, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

---

## 🖼️ Image Upload (Cloudinary)

1. Sign up at https://cloudinary.com
2. Get credentials from Dashboard
3. Add to environment variables

---

## 🔒 Security Checklist

- [ ] Set strong JWT secrets
- [ ] Use HTTPS everywhere
- [ ] Set CORS properly for your domain
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Use helmet.js (included)
- [ ] Validate all inputs (included with Zod)
- [ ] Hash passwords (included with bcryptjs)
- [ ] Use secure cookies (if implementing)

---

## 📊 Monitoring & Maintenance

### Monitor Backend

```bash
# Check logs on Render
# Go to Render Dashboard → Service → Logs

# Or use PM2
pm2 logs eventmates-api
pm2 monit
```

### Monitor Frontend

```bash
# Vercel Analytics
# Check at https://vercel.com/dashboard
```

---

## 🆘 Troubleshooting

### Backend won't start

```bash
# Check Node version
node --version # Should be v16+

# Clear dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS errors

Add your frontend URL to CORS in `src/server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true,
}));
```

### Database connection failed

1. Check MongoDB URI is correct
2. Whitelist your IP address
3. Verify username/password
4. Check network connectivity

### Payment not working

1. Verify Razorpay keys are correct
2. Check webhook endpoint
3. Test with provided test credentials

---

## 📈 Performance Optimization

### Frontend

- [ ] Enable code splitting
- [ ] Use Vite build optimization
- [ ] Compress images
- [ ] Use CDN for static assets
- [ ] Implement lazy loading

### Backend

- [ ] Enable database indexing ✓
- [ ] Use connection pooling
- [ ] Cache frequently accessed data
- [ ] Implement pagination
- [ ] Use clustering for Node.js

---

## 🚀 Scaling for Production

### Database

```javascript
// Add indexes for frequently queried fields
db.events.createIndex({ organizerId: 1 });
db.events.createIndex({ status: 1 });
db.users.createIndex({ email: 1 });
```

### CDN

- Use CloudFront (AWS) or Cloudflare
- Serve static assets globally

### Load Balancing

- Use Render auto-scaling
- Or AWS Load Balancer

### Caching

```javascript
// Add Redis for caching
const redis = require('redis');
const client = redis.createClient();
```

---

## 📋 Pre-Launch Checklist

- [ ] All environment variables set
- [ ] Database migrated and indexes created
- [ ] HTTPS enabled everywhere
- [ ] Test all features
- [ ] Email notifications working
- [ ] Payment flow tested
- [ ] Error handling in place
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers set

---

## 🎯 Post-Launch

1. Monitor error logs
2. Track user feedback
3. Optimize based on usage
4. Plan feature updates
5. Scale infrastructure as needed

---

**Deployment Complete! 🎉**
