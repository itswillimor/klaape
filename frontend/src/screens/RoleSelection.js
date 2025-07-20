import React, { useState, useRef } from "react";
import {
  View,
  Text,
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

  const handlePress = (id) => {
    setSelected(id);
    
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
  
  return (
    <ImageBackground 
      source={require('../../assets/images/splash-icon.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>How do you want to use Klaape?</Text>
        
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
              <Text style={styles.cardText}>Regular User</Text>
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
              <Text style={styles.cardText}>Pro Creator</Text>
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
              <Text style={styles.cardText}>Business</Text>
            </View>
          </TouchableOpacity>
        </View>

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
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(10, 0, 21, 0.85)",
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
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  cardText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#FFD700",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 80,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#999",
    opacity: 0.7,
    shadowOpacity: 0,
  },
  continueText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RoleSelection;