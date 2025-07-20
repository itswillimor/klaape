import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/Splash';
import Auth from '../screens/Auth';
import EmailVerification from '../screens/EmailVerification';
import RoleSelection from '../screens/RoleSelection';
import Profile from '../screens/Profile';
import ProfilePicture from '../screens/ProfilePicture';
import Home from '../screens/Home';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="RoleSelection" component={RoleSelection} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ProfilePicture" component={ProfilePicture} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
