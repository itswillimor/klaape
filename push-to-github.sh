#!/bin/bash

# Script to push updates to GitHub and sync with Codespace

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

# Check if there are changes to commit
if git status --porcelain | grep -q .; then
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
else
  echo -e "${YELLOW}No changes to commit.${NC}"
fi

# Instructions for syncing with Codespace
echo -e "\n${GREEN}To sync these changes with your Codespace:${NC}"
echo -e "1. Open your Codespace"
echo -e "2. Run: ${YELLOW}git pull${NC}"
echo -e "3. If you have dependencies changes, run: ${YELLOW}cd backend && pip install -r requirements.txt${NC}"
echo -e "4. And: ${YELLOW}cd ../frontend && npm install${NC}"