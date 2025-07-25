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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ProfilePicture() {
  const navigation = useNavigation();
  const route = useRoute();
  const userRole = route.params?.role || 'regular';
  const [selectedImage, setSelectedImage] = useState(null);
  const glowAnim = useRef(new Animated.Value(0)).current;

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
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setSelectedImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleContinue = async () => {
    try {
      if (!selectedImage) {
        Alert.alert(
          'No Profile Picture',
          'Are you sure you want to continue without a profile picture?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Continue', 
              onPress: () => {
                navigation.navigate('Home');
              }
            }
          ]
        );
        return;
      }
      
      // In a real app, this would upload the image to a server
      navigation.navigate('Home');
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

  return (
    <ImageBackground
      source={require('../../assets/images/splash-icon.png')}
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
            <Animated.View style={[styles.cardContainer, { opacity: glowOpacity }]}>
              {/* Image Preview */}
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={{ color: "#fff", fontSize: 16 }}>Tap to add photo</Text>
                </View>
              )}

              {/* Camera Button */}
              <TouchableOpacity style={[styles.cameraButton, { backgroundColor: roleColors.button }]} onPress={pickImage}>
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
            style={[styles.continueBtn, { backgroundColor: roleColors.button }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
    borderWidth: 3,
    borderColor: "#9d4edd",
    borderRadius: 20,
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