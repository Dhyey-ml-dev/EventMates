#!/bin/bash

# EventMates - Quick Start Script
# This script helps you get the entire platform running in one command

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   EventMates - Quick Start Script      ║"
echo "║                                        ║"
echo "║   This will start the entire platform ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is running
echo -e "${YELLOW}📌 Checking MongoDB...${NC}"
if ! lsof -i :27017 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  MongoDB is not running${NC}"
    echo "Starting MongoDB..."
    
    if command -v mongod &> /dev/null; then
        mongod &
        sleep 2
        echo -e "${GREEN}✅ MongoDB started${NC}"
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
        sleep 2
        echo -e "${GREEN}✅ MongoDB started${NC}"
    else
        echo -e "${RED}❌ MongoDB is not installed or could not be started${NC}"
        echo "Please start MongoDB manually: mongod"
        exit 1
    fi
else
    echo -e "${GREEN}✅ MongoDB is running${NC}"
fi

# Check if port 5001 is available
if lsof -i :5001 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 5001 is already in use${NC}"
    echo "Please close the process using port 5001"
    exit 1
fi

# Check if port 5173 is available
if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 5173 is already in use${NC}"
    echo "Please close the process using port 5173"
    exit 1
fi

echo -e "${GREEN}✅ Ports are available${NC}"
echo ""

# Navigate to server directory
cd "$(dirname "$0")/server"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing server dependencies...${NC}"
    npm install
fi

# Install frontend dependencies if needed
cd "../client"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

cd ..

echo ""
echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "╔════════════════════════════════════════╗"
echo "║     Starting EventMates Platform       ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🌍 Frontend: http://localhost:5173"
echo "🔗 Backend API: http://localhost:5001/api"
echo "📊 MongoDB: localhost:27017"
echo ""
echo -e "${YELLOW}Tip: Open these URLs in your browser:${NC}"
echo "  - Frontend: http://localhost:5173"
echo "  - API Health: http://localhost:5001/health"
echo ""

# Start backend
echo -e "${YELLOW}🚀 Starting backend server...${NC}"
cd server
npm run dev &
SERVER_PID=$!

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start backend server${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend started (PID: $SERVER_PID)${NC}"

# Start frontend
echo -e "${YELLOW}🚀 Starting frontend server...${NC}"
cd ../client
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start frontend server${NC}"
    kill $SERVER_PID
    exit 1
fi

echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo "╔════════════════════════════════════════╗"
echo "║     ✅ Platform is Running!            ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Handle cleanup on script exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Shutdown complete${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait
