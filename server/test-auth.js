#!/usr/bin/env node

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let tokens = {};

async function test() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║     EventMates Authentication Test     ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Test 1: Health Check
    console.log('📊 Test 1: Health Check...');
    const healthResponse = await axios.get('http://localhost:5001/health');
    console.log('✅ Server is running\n');

    // Test 2: Signup
    console.log('📊 Test 2: Testing Signup...');
    const signupPayload = {
      email: `test${Date.now()}@eventmates.com`,
      password: 'Test@123456',
      firstName: 'Test',
      lastName: 'User',
      role: 'student',
    };

    const signupResponse = await apiClient.post('/auth/signup', signupPayload);
    console.log('✅ Signup Successful');
    console.log('   User:', signupResponse.data.data.user.email);
    console.log('   Token:', signupResponse.data.data.accessToken.substring(0, 20) + '...\n');

    tokens = {
      accessToken: signupResponse.data.data.accessToken,
      refreshToken: signupResponse.data.data.refreshToken,
    };

    // Test 3: Get Current User
    console.log('📊 Test 3: Testing Get Current User...');
    apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return config;
    });

    const userResponse = await apiClient.get('/auth/me');
    console.log('✅ Get Current User Successful');
    console.log('   User:', userResponse.data.data.user.email + '\n');

    // Test 4: Logout
    console.log('📊 Test 4: Testing Logout...');
    await apiClient.post('/auth/logout');
    console.log('✅ Logout Successful\n');

    // Test 5: Login with new credentials
    console.log('📊 Test 5: Testing Login...');
    const loginResponse = await apiClient.post('/auth/login', {
      email: signupPayload.email,
      password: signupPayload.password,
    });
    console.log('✅ Login Successful');
    console.log('   User:', loginResponse.data.data.user.email);
    console.log('   Token:', loginResponse.data.data.accessToken.substring(0, 20) + '...\n');

    console.log('╔════════════════════════════════════════╗');
    console.log('║     ✅ All Tests Passed!              ║');
    console.log('╚════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Test Failed!');
    console.error('Error:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

test();
