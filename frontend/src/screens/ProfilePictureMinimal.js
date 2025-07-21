import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ProfilePictureMinimal() {
  const navigation = useNavigation();
  const route = useRoute();
  const userRole = route.params?.role || 'regular';
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [imageSet, setImageSet] = useState(false);
  
  // Animation refs
  const glowAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // Animate glow pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { 
          toValue: 1, 
          duration: 1200, 
          useNativeDriver: Platform.OS !== 'web' 
        }),
        Animated.timing(glowAnim, { 
          toValue: 0, 
          duration: 1200, 
          useNativeDriver: Platform.OS !== 'web' 
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  // Success animation when image is set
  const runSuccessAnimation = () => {
    // Reset animations
    successAnim.setValue(0);
    checkmarkScale.setValue(0);
    
    // Run success animations
    Animated.sequence([
      // Flash the frame
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(successAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }),
      // Show checkmark
      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      // Hide checkmark after 1.5 seconds
      setTimeout(() => {
        Animated.timing(checkmarkScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      }, 1500);
    });
  };

  // Handle Image Picker
  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web implementation
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setCroppedImage(imageUrl); // For web, just use the selected image
            setImageSet(true);
            runSuccessAnimation();
          }
        };
        input.click();
      } else {
        // Native implementation
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission required", "Allow access to photos to upload.");
          return;
        }
        
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true, // Use built-in editor instead
          aspect: [1, 1],
          quality: 0.8,
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setSelectedImage(result.assets[0].uri);
          setCroppedImage(result.assets[0].uri);
          setImageSet(true);
          runSuccessAnimation();
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleContinue = async () => {
    try {
      if (!croppedImage) {
        Alert.alert(
          'No Profile Picture',
          'Are you sure you want to continue without a profile picture?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Continue', 
              onPress: () => {
                Alert.alert('Success', 'Profile setup completed!');
                // In real app: navigation.navigate('Home');
              }
            }
          ]
        );
        return;
      }
      
      Alert.alert('Success', 'Profile picture uploaded successfully!');
      // In real app: navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Get role-specific colors and text
  const getRoleColors = () => {
    switch(userRole) {
      case 'pro':
        return {
          gradient: ['#FF00FF', '#9747FF'],
          button: '#FF00FF',
          tag: 'PRO CREATOR'
        };
      case 'business':
        return {
          gradient: ['#F5B800', '#E09200'],
          button: '#F5B800',
          tag: 'BUSINESS'
        };
      default:
        return {
          gradient: ['#b517ff', '#7000ff'],
          button: '#9d4edd',
          tag: 'REGULAR USER'
        };
    }
  };

  const roleColors = getRoleColors();

  // Background image based on platform
  const backgroundSource = Platform.OS === 'web' 
    ? { uri: "https://ik.imagekit.io/ynb2ey9lj/91806EDD-48C9-4CDF-87D5-31258DF4FA26.png?updatedAt=1752849536100" }
    : { uri: "https://ik.imagekit.io/ynb2ey9lj/91806EDD-48C9-4CDF-87D5-31258DF4FA26.png?updatedAt=1752849536100" };

  // Success border color animation
  const successBorderColor = successAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(151, 71, 255, 1)', 'rgba(50, 205, 50, 1)'],
  });

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.bgImage}
    >
      <View style={styles.darkOverlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Profile Picture</Text>

          {/* Tag */}
          <View style={[styles.tagContainer, { borderColor: roleColors.button }]}>
            <Text style={styles.tagText}>{roleColors.tag}</Text>
          </View>

          {/* Profile Frame */}
          <TouchableOpacity activeOpacity={0.9} onPress={pickImage}>
            <Animated.View style={[
              styles.cardContainer, 
              { opacity: glowOpacity }
            ]}>
              {/* SVG Frame with cut corner */}
              <Svg height="230" width="230" style={{ position: "absolute" }}>
                <Defs>
                  <LinearGradient id="profileGlow" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor={roleColors.gradient[0]} />
                    <Stop offset="1" stopColor={roleColors.gradient[1]} />
                  </LinearGradient>
                </Defs>

                <Animated.Path
                  d="M0 50 L0 230 L230 230 L230 0 L50 0 Z"
                  stroke={imageSet ? successBorderColor : "url(#profileGlow)"}
                  strokeWidth="6"
                  fill="rgba(20,0,40,0.5)"
                />
              </Svg>

              {/* Image Preview */}
              {croppedImage ? (
                <Image source={{ uri: croppedImage }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={{ color: "#fff", fontSize: 16 }}>Tap to add photo</Text>
                </View>
              )}

              {/* Success Checkmark */}
              <Animated.View style={[
                styles.checkmarkContainer,
                { transform: [{ scale: checkmarkScale }] }
              ]}>
                <View style={styles.checkmarkCircle}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              </Animated.View>

              {/* Camera Button */}
              <TouchableOpacity 
                style={[styles.cameraButton, { backgroundColor: roleColors.button }]} 
                onPress={pickImage}
              >
                <Text style={{ fontSize: 20 }}>📷</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>

          {/* Buttons */}
          <TouchableOpacity 
            style={[styles.uploadBtn, { backgroundColor: roleColors.button }]} 
            onPress={pickImage}
          >
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.continueBtn, 
              { backgroundColor: roleColors.button },
              !croppedImage && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!croppedImage}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Skipped', 'Profile picture setup skipped')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: "cover",
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: "rgba(20,0,40,0.85)", // Dark purple overlay
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },
  tagContainer: {
    borderWidth: 2,
    borderColor: "#9d4edd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 15,
  },
  tagText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cardContainer: {
    width: 230,
    height: 230,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  uploadedImage: {
    width: 210,
    height: 210,
    borderRadius: 10,
    resizeMode: "cover",
  },
  placeholder: {
    width: 210,
    height: 210,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    zIndex: 10,
  },
  checkmarkCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(50, 205, 50, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#9d4edd",
    padding: 8,
    borderRadius: 20,
  },
  uploadBtn: {
    backgroundColor: "#9d4edd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginBottom: 15,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  continueBtn: {
    backgroundColor: "#9d4edd",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 70,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#999",
    opacity: 0.7,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipText: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
  },
});