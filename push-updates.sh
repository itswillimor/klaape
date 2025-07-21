#!/bin/bash

# Script to push updates to GitHub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get commit message from argument or prompt
if [ -z "$1" ]; then
  echo -e "${YELLOW}Enter commit message:${NC}"
  read -r COMMIT_MESSAGE
else
  COMMIT_MESSAGE="$1"
fi

# Add all changes
echo -e "${GREEN}Adding changes...${NC}"
git add .

# Commit changes
echo -e "${GREEN}Committing changes with message: ${YELLOW}$COMMIT_MESSAGE${NC}"
git commit -m "$COMMIT_MESSAGE"

# Push to GitHub
echo -e "${GREEN}Pushing to GitHub...${NC}"
git push

echo -e "${GREEN}Changes pushed to GitHub successfully!${NC}"