#!/bin/bash

# Script to run Expo in GitHub Codespaces with proper host settings
# This enables connection from external devices

# Get the Codespace name from environment variable
CODESPACE_NAME=${CODESPACE_NAME:-localhost}

# Set the Expo host to the Codespace URL
if [ "$CODESPACE_NAME" != "localhost" ]; then
  EXPO_HOST="$CODESPACE_NAME-19000.preview.app.github.dev"
  echo "Running in GitHub Codespace: $EXPO_HOST"
else
  EXPO_HOST="localhost"
  echo "Running locally"
fi

# Start Expo with the appropriate host settings
echo "Starting Expo..."
export REACT_NATIVE_PACKAGER_HOSTNAME=$EXPO_HOST
npx expo start --tunnel