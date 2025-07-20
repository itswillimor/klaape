#!/bin/bash

# Setup script for Klaape development environment

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Klaape development environment...${NC}"

# Check if Python is installed
if command -v python3 &>/dev/null; then
    echo -e "${GREEN}Python is installed.${NC}"
else
    echo -e "${RED}Python is not installed. Please install Python 3.10 or higher.${NC}"
    exit 1
fi

# Check if Node.js is installed
if command -v node &>/dev/null; then
    echo -e "${GREEN}Node.js is installed.${NC}"
else
    echo -e "${RED}Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check if Docker is installed (optional)
if command -v docker &>/dev/null; then
    echo -e "${GREEN}Docker is installed. You can use PostgreSQL with Docker.${NC}"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}Docker is not installed. You will use SQLite for development.${NC}"
    DOCKER_AVAILABLE=false
fi

# Setup backend
echo -e "${GREEN}Setting up backend...${NC}"
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Create superuser
echo -e "${YELLOW}Do you want to create a superuser? (y/n)${NC}"
read -r create_superuser
if [ "$create_superuser" = "y" ]; then
    python manage.py createsuperuser
fi

# Setup frontend
echo -e "${GREEN}Setting up frontend...${NC}"
cd ../frontend

# Install dependencies
echo "Installing dependencies..."
npm install

# Start PostgreSQL if Docker is available
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo -e "${YELLOW}Do you want to start PostgreSQL with Docker? (y/n)${NC}"
    read -r start_postgres
    if [ "$start_postgres" = "y" ]; then
        cd ..
        echo "Starting PostgreSQL with Docker..."
        docker-compose up -d db
        echo "PostgreSQL is running. Update your .env file to use it."
    fi
fi

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}To start the backend:${NC}"
echo "cd backend"
echo "source venv/bin/activate"
echo "python manage.py runserver"
echo -e "${YELLOW}To start the frontend:${NC}"
echo "cd frontend"
echo "npm start"