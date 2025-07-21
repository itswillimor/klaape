import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const RoleSelection = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pre-load images to avoid loading during animations
  const images = useMemo(() => ({
    background: "https://ik.imagekit.io/ynb2ey9lj/91806EDD-48C9-4CDF-87D5-31258DF4FA26.png?updatedAt=1752849536100",
    regularUser: "https://ik.imagekit.io/zuxttbshx/A19AFC48-3EAF-4B97-875B-898AE712BEFE.png?updatedAt=1752958681147",
    proCreator: "https://ik.imagekit.io/zuxttbshx/68751776-3F10-4BD2-9BBF-FF52F1A154B5.png?updatedAt=1752958541096",
    business: "https://ik.imagekit.io/zuxttbshx/6BD6CB6D-143E-4753-A00A-01B8E7D72FFB.png?updatedAt=1752958541096"
  }), []);

  // Use inline style for web platform
  const backgroundStyle = Platform.OS === 'web' ? {
    backgroundImage: `url("${images.background}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  const handlePress = (id) => {
    setSelected(id);
    
    // Simplified animation sequence
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (selected) {
      // Convert role names to internal role IDs
      let roleId = "regular";
      if (selected === "Pro Creator") roleId = "pro";
      if (selected === "Business") roleId = "business";
      
      // Navigate to Profile screen with role parameter
      navigation.navigate("Profile", { role: roleId });
    }
  };
  
  // Memoize card components to prevent unnecessary re-renders
  const renderCards = useMemo(() => (
    <View style={styles.cardContainer}>
      {/* Regular User */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePress("Regular User")}
      >
        <View style={[
          styles.card,
          selected === "Regular User" && styles.selectedCard
        ]}>
          <Image
            source={{ uri: images.regularUser }}
            style={styles.cardImage}
          />
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📱</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Pro Creator */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePress("Pro Creator")}
      >
        <View style={[
          styles.card,
          selected === "Pro Creator" && styles.selectedCard
        ]}>
          <Image
            source={{ uri: images.proCreator }}
            style={styles.cardImage}
          />
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💰</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Business */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePress("Business")}
      >
        <View style={[
          styles.card,
          selected === "Business" && styles.selectedCard
        ]}>
          <Image
            source={{ uri: images.business }}
            style={styles.cardImage}
          />
        </View>
      </TouchableOpacity>
    </View>
  ), [selected, images]);
  
  return (
    <ImageBackground
      source={{ uri: images.background }}
      style={[styles.background, backgroundStyle]}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>How do you want to use Klaape?</Text>
        
        {renderCards}

        {/* Continue Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.continueButton, !selected && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={handleContinue}
            disabled={!selected}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 30,
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  card: {
    width: 320,
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 10,
    position: "relative",
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: "#FFD700",
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 0 20px #FFD700',
      },
    }),
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  iconContainer: {
    position: "absolute",
    bottom: 15,
    right: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
  },
  continueButton: {
    backgroundColor: "#FFD700",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 80,
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 25,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 0 25px rgba(255, 215, 0, 0.8)',
      },
    }),
  },
  disabledButton: {
    backgroundColor: "#999",
    opacity: 0.7,
  },
  continueText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RoleSelection;