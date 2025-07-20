import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomShapedAvatar from '../components/CustomShapedAvatar';
import { profileAPI } from '../services/api';

const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { role = 'regular' } = route.params || {};
  
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    imageUri: null,
    role: role
  });
  
  const [isEditing, setIsEditing] = useState(true); // Start in edit mode since this is profile creation
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('1'); // Placeholder - would come from auth context
  
  // Fetch profile data from API if it exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileAPI.getProfile(userId);
        
        // If profile exists, update state and switch to view mode
        if (data) {
          setProfile({
            ...data,
            role: data.role || role // Use role from API or from route params
          });
          setIsEditing(false); // Switch to view mode if profile exists
        }
      } catch (error) {
        console.log('No existing profile found, creating new profile');
        // If no profile exists, stay in edit mode to create one
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId, role]);
  
  // Role-specific UI elements
  const getRoleSpecificUI = () => {
    switch (role) {
      case 'pro':
        return (
          <View style={styles.proSection}>
            <Text style={styles.sectionTitle}>Pro Creator Settings</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Expertise</Text>
              <TextInput
                style={styles.input}
                placeholder="Your area of expertise"
                placeholderTextColor="#999"
                editable={isEditing}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Hourly Rate</Text>
              <TextInput
                style={styles.input}
                placeholder="$0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>
          </View>
        );
      case 'business':
        return (
          <View style={styles.businessSection}>
            <Text style={styles.sectionTitle}>Business Profile</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your company name"
                placeholderTextColor="#999"
                editable={isEditing}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Industry</Text>
              <TextInput
                style={styles.input}
                placeholder="Your industry"
                placeholderTextColor="#999"
                editable={isEditing}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save profile data to backend
      await profileAPI.updateProfile(userId, profile);
      
      // If there's a new image, upload it
      if (profile.imageUri && profile.imageUri.startsWith('file://')) {
        await profileAPI.uploadProfileImage(userId, profile.imageUri);
      }
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Profile</Text>
        
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <CustomShapedAvatar 
            userRole={role}
            size={150}
          />
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Basic Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#999"
              value={profile.name}
              onChangeText={(text) => setProfile({...profile, name: text})}
              editable={isEditing}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="@username"
              placeholderTextColor="#999"
              value={profile.username}
              onChangeText={(text) => setProfile({...profile, username: text})}
              editable={isEditing}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell us about yourself"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={profile.bio}
              onChangeText={(text) => setProfile({...profile, bio: text})}
              editable={isEditing}
            />
          </View>
        </View>
        
        {/* Role-specific UI */}
        {getRoleSpecificUI()}
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.buttonText}>Save Profile</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={handleEdit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0015',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  changePhotoButton: {
    marginTop: 10,
    padding: 8,
  },
  changePhotoText: {
    color: '#FFD700',
    fontSize: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  proSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderRadius: 10,
  },
  businessSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(245, 184, 0, 0.1)',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  settingItem: {
    marginBottom: 15,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 60,
    width: '100%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#9747FF',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 60,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;