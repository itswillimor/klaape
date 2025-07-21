# Klaape Frontend

This is the frontend for the Klaape platform, built with React Native and Expo.

## Screens

The app includes the following screens:

1. **Splash Screen**: Animated intro screen with the Klaape logo
2. **Auth Screen**: Login and signup functionality
3. **Email Verification**: 6-digit code verification
4. **Role Selection**: Choose between Regular User, Pro Creator, or Business
5. **Profile**: Set up your profile with role-specific fields
6. **Profile Picture**: Upload and customize your profile picture
7. **Home**: Main app screen (placeholder)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Expo CLI

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Run on specific platforms:
   ```
   npm run ios     # Run on iOS simulator
   npm run android # Run on Android emulator
   npm run web     # Run in web browser
   ```

## Using in GitHub Codespaces

When running in GitHub Codespaces, use the following command to start the server:

```
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 npm start -- --tunnel
```

This will create a tunnel that allows you to access the app from your mobile device using the Expo Go app.

## Customizing Images

To use your own images:

1. Replace the placeholder images in the `assets/images` directory
2. Update the image references in the screens

## Adding New Screens

To add a new screen:

1. Create a new file in the `src/screens` directory
2. Add the screen to the navigation stack in `src/navigation/AppNavigator.js`