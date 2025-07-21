import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function SplashBackup({ navigation }) {
  const [stage, setStage] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Switch to stage 2 with gentle fade
    const timer1 = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setStage(2);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    // Navigate to Auth
    const timer2 = setTimeout(() => {
      navigation.replace("Auth");
    }, 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const currentImage = stage === 1 
    ? "https://ik.imagekit.io/zuxttbshx/286EB035-117E-46B7-89ED-B3DEA6154753.png?updatedAt=1753067168912"
    : "https://ik.imagekit.io/zuxttbshx/A6170851-92C4-47CF-84A0-C40209405256.png?updatedAt=1753067168966";

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.imageContainer,
        { opacity: fadeAnim }
      ]}>
        <Image
          source={{ uri: currentImage }}
          style={styles.backgroundImage}
          resizeMode="contain"
        />
        
        {/* Dark Overlay */}
        <View style={styles.darkOverlay} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033', // Match the purple background from images
  },
  imageContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  darkOverlay: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});