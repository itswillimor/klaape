import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, ImageBackground } from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function Splash({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
  const [currentBg, setCurrentBg] = useState(0);

  const lavaAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;

  const backgrounds = [
    "https://ik.imagekit.io/ynb2ey9lj/8AE953F0-6177-4DF6-B9A3-8C32C2A172E1%203.PNG?updatedAt=1752784207195",
    "https://ik.imagekit.io/ynb2ey9lj/55B856AC-0371-4B3D-B2DA-720958A4C017%203.PNG?updatedAt=1752848603251"
  ];
  const logo = "https://ik.imagekit.io/ynb2ey9lj/DC9F20C3-E296-4AED-AE99-4A0DF06B0B92.PNG?updatedAt=1752848603287";

  useEffect(() => {
    // Logo entrance animation
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

    // Pulsing effect
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Golden glow
    const glow = Animated.loop(
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    pulse.start();
    glow.start();

    // Switch backgrounds
    const bgTimer = setTimeout(() => {
      setCurrentBg(1);
    }, 2000);

    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(bgTimer);
      pulse.stop();
      glow.stop();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground
      source={{ uri: backgrounds[currentBg] }}
      style={styles.container}
    >
      <Animated.View style={[
        styles.logoContainer, 
        { 
          transform: [
            { scale: logoScale },
            { scale: pulseAnim }
          ] 
        }
      ]}>
        <Image source={{ uri: logo }} style={styles.logoImage} />
        <Animated.View style={[styles.glow, { opacity: glowAnim }]} />
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  glow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FFD700',
    opacity: 0.2,
    zIndex: -1,
  },
});