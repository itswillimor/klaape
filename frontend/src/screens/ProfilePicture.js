import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomShapedAvatar from '../components/CustomShapedAvatar';
import { profileAPI } from '../services/api';

const ProfilePicture = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role = 'regular' } = route.params || {};
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Define avatar frame options based on role
  const avatarFrames = [
    { id: 'default', label: 'Default' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'diamond', label: 'Diamond' },
  ];
  
  const [selectedFrame, setSelectedFrame] = useState('default');
  
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to grant access to your photos to select a profile picture.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to grant access to your camera to take a profile picture.');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };
  
  const handleComplete = async () => {
    try {
      setLoading(true);
      
      if (selectedImage) {
        // In a real app, this would call the API to upload the image
        // await profileAPI.uploadProfileImage('user-id', selectedImage);
      }
      
      // For demo purposes, just navigate to home
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home');
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to save profile picture');
    }
  };
  
  return (
    <ImageBackground
      source={require('../../assets/images/splash-icon.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile Picture</Text>
            <Text style={styles.subtitle}>Add a photo to personalize your profile</Text>
          </View>
          
          <View style={styles.avatarContainer}>
            <CustomShapedAvatar
              imageUri={selectedImage}
              userRole={role}
              size={180}
            />
          </View>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
              <Text style={styles.optionText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.framesContainer}>
            <Text style={styles.framesTitle}>Choose a Frame</Text>
            <View style={styles.frameOptions}>
              {avatarFrames.map((frame) => (
                <TouchableOpacity
                  key={frame.id}
                  style={[
                    styles.frameOption,
                    selectedFrame === frame.id && styles.selectedFrameOption,
                  ]}
                  onPress={() => setSelectedFrame(frame.id)}
                >
                  <Text
                    style={[
                      styles.frameOptionText,
                      selectedFrame === frame.id && styles.selectedFrameOptionText,
                    ]}
                  >
                    {frame.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.completeButton, loading && styles.disabledButton]}
              onPress={handleComplete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.completeButtonText}>Complete Setup</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => navigation.navigate('Home')}
              disabled={loading}
            >
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 0, 21, 0.85)',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  avatarContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: 'rgba(151, 71, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(151, 71, 255, 0.4)',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  framesContainer: {
    width: '100%',
    marginBottom: 30,
  },
  framesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  frameOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  frameOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedFrameOption: {
    backgroundColor: 'rgba(151, 71, 255, 0.3)',
    borderColor: 'rgba(151, 71, 255, 0.8)',
  },
  frameOptionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  selectedFrameOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  completeButton: {
    backgroundColor: '#9747FF',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#9747FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  skipButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
});

export default ProfilePicture;