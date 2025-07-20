#!/bin/bash

# Script to initialize Git repository and push to GitHub
# Usage: ./setup-github.sh <github-username> <repository-name>

if [ $# -lt 2 ]; then
  echo "Usage: $0 <github-username> <repository-name>"
  exit 1
fi

USERNAME=$1
REPO_NAME=$2

echo "Setting up Git repository for $USERNAME/$REPO_NAME..."

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
else
  echo "Git repository already initialized."
fi

# Add all files
echo "Adding files to Git..."
git add .

# Commit changes
echo "Committing files..."
git commit -m "Initial commit"

# Add GitHub remote
echo "Adding GitHub remote..."
git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Your repository is now available at: https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo "Next steps:"
echo "1. Set up your Django backend"
echo "2. Configure your database"
echo "3. Start developing your app"
echo ""
echo "To run the frontend:"
echo "cd frontend && npm start"
echo ""
echo "To run the backend:"
echo "cd backend && python manage.py runserver"