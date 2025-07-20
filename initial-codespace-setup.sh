#!/bin/bash

# Initial setup script for GitHub Codespace
# Run this once to get all the scripts and files

# Pull the latest changes from GitHub
git pull origin main

# Make scripts executable
chmod +x *.sh

echo "Initial setup complete! You can now use ./sync-codespace.sh for future updates."