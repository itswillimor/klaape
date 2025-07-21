import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function Splash({ navigation }) {
  const [typingText, setTypingText] = useState("");
  const finalText = "Connect. Create. Earn.";
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Connect. ", "Create. ", "Earn."];

  const text1Opacity = useRef(new Animated.Value(0)).current;
  const text2Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in "What's Klaapening?"
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(text1Opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(text1Opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(text2Opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => startTypingEffect());
  }, []);

  const startTypingEffect = () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < finalText.length) {
        setTypingText(finalText.substring(0, i + 1));
        // Update word index based on current position
        if (i >= 8 && i < 16) setCurrentWordIndex(1); // Create
        else if (i >= 16) setCurrentWordIndex(2); // Earn
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          navigation.replace("Auth");
        }, 1500);
      }
    }, 120);
  };

  return (
    <LinearGradient
      colors={["#010220", "#010220", "#010220"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Logo */}
      <Image
        source={{ uri: "https://ik.imagekit.io/ynb2ey9lj/2B7A09A6-5317-44A9-AE61-3E97D7F95293.PNG?updatedAt=1752848606601" }}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Klaape */}
      <Text style={styles.title}>Klaape</Text>

      {/* What's Klaapening */}
      <Animated.Text style={[styles.subText, { opacity: text1Opacity }]}>
        What's Klaapening?
      </Animated.Text>

      {/* Typing Effect */}
      <Animated.View style={{ opacity: text2Opacity }}>
        <Text>
          <Text style={styles.typingTextYellow}>
            {typingText.substring(0, 16)}
          </Text>
          <Text style={styles.typingTextOrange}>
            {typingText.substring(16)}
          </Text>
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#F7E9C8", // Cream color like your design
    marginBottom: 12,
  },
  subText: {
    fontSize: 20,
    color: "#F7E9C8",
    marginTop: 5,
  },
  typingTextYellow: {
    fontSize: 20,
    color: "#FFD500",
    fontWeight: "600",
  },
  typingTextOrange: {
    fontSize: 20,
    color: "#D46E00",
    fontWeight: "600",
  },
});