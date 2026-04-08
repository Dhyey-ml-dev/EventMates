import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// Import database
import { connectDB } from './config/database.js';

// Import seed function
import { seedSampleEvents } from './seeds/sampleEvents.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import middlewares
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Seed sample events on startup
seedSampleEvents();

// ======================== Middlewares ========================

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging
app.use(morgan('combined'));

// Rate limiting (apply after important routes)
app.use('/api/', apiLimiter);

// ======================== Routes ========================

app.get('/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

// ======================== Start Server ========================

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║  🚀 EventMates Server is Running       ║
    ║  📍 Port: ${PORT}                      
    ║  🌍 Frontend: ${process.env.FRONTEND_URL}
    ║  🔧 Environment: ${process.env.NODE_ENV || 'development'}
    ╚════════════════════════════════════════╝
    `);
  });
}

export default app;
