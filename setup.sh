#!/bin/bash

# EventMates Quick Start Setup Script

echo "🚀 EventMates - Quick Start Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd server

# Copy env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please edit it with your configuration:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - Other optional services (Razorpay, Cloudinary, Email)"
fi

# Install dependencies
echo "📥 Installing backend dependencies..."
npm install

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../client

# Copy env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file"
fi

# Install dependencies
echo "📥 Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Configure your backend environment:"
echo "   nano ../server/.env"
echo ""
echo "2. Start the backend (in terminal 1):"
echo "   cd server && npm run dev"
echo ""
echo "3. Start the frontend (in terminal 2):"
echo "   cd client && npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "================"
echo "- Main README: ../README.md"
echo "- Deployment: ../DEPLOYMENT.md"
echo "- Contributing: ../CONTRIBUTING.md"
echo ""
echo "Happy Coding! 🚀"
