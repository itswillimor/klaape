#!/bin/bash

# Script to sync Codespace with GitHub updates

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Syncing Codespace with GitHub...${NC}"

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull

# Check if backend requirements need updating
if git diff --name-only HEAD@{1} HEAD | grep -q "backend/requirements.txt"; then
  echo -e "${YELLOW}Backend requirements changed. Updating...${NC}"
  cd backend
  pip install -r requirements.txt
  cd ..
fi

# Check if frontend dependencies need updating
if git diff --name-only HEAD@{1} HEAD | grep -q "frontend/package.json"; then
  echo -e "${YELLOW}Frontend dependencies changed. Updating...${NC}"
  cd frontend
  npm install
  cd ..
fi

# Check if database migrations are needed
if git diff --name-only HEAD@{1} HEAD | grep -q "backend/.*migrations/"; then
  echo -e "${YELLOW}Database migrations detected. Running migrations...${NC}"
  cd backend
  python manage.py migrate
  cd ..
fi

echo -e "${GREEN}Sync complete! Your Codespace is now up to date.${NC}"