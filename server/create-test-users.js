#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventmates';

async function createTestUsers() {
  try {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   Creating Test Users for EventMates   ║');
    console.log('╚════════════════════════════════════════╝\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('📌 Connected to MongoDB\n');

    // Test users to create
    const testUsers = [
      {
        email: 'student@eventmates.com',
        password: 'Student@123456',
        firstName: 'John',
        lastName: 'Student',
        role: 'student',
      },
      {
        email: 'organizer@eventmates.com',
        password: 'Organizer@123456',
        firstName: 'Jane',
        lastName: 'Organizer',
        role: 'organizer',
      },
      {
        email: 'admin@eventmates.com',
        password: 'Admin@123456',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      },
    ];

    // Delete existing test users
    console.log('🗑️  Cleaning up existing test users...');
    for (const user of testUsers) {
      await User.deleteOne({ email: user.email });
    }
    console.log('✅ Cleanup complete\n');

    // Create new test users
    console.log('👤 Creating test users...');
    for (const userData of testUsers) {
      const user = await User.create(userData);
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
    }

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     ✅ Test Users Created!            ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('You can now login with these credentials:\n');
    testUsers.forEach((user) => {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}\n`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:');
    console.error(error.message);
    process.exit(1);
  }
}

createTestUsers();
