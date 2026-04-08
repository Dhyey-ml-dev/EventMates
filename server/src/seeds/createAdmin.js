import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Skip if running without MongoDB
    const conn = await connectDB();
    if (!conn) {
      console.log('✅ Running in demo mode - Admin will be created in memory');
      // For demo mode, we'll use a mock admin that validates in the controller
      return {
        _id: 'admin_demo_id',
        email: 'admin@eventmates.com',
        role: 'admin',
        isVerified: true,
        status: 'active',
      };
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: 'admin@eventmates.com',
      role: 'admin'
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash('Admin@123456', 10);

    // Create admin user
    const adminUser = new User({
      role: 'admin',
      email: 'admin@eventmates.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true,
      status: 'active',
      profileCompletionPercentage: 100,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@eventmates.com');
    console.log('🔐 Password: Admin@123456');
    console.log('⚠️  Please change this password in production!');
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    // For demo mode without MongoDB, create mock admin
    if (error.message.includes('ECONNREFUSED') || error.message.includes('getaddrinfo')) {
      console.log('\n✅ Demo Mode Activated');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 ADMIN LOGIN CREDENTIALS (Demo Mode)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:    admin@eventmates.com');
      console.log('🔐 Password: Admin@123456');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Admin will authenticate without requiring database');
      return { email: 'admin@eventmates.com', role: 'admin' };
    }
    
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

export default createAdminUser;
