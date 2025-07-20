import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomShapedAvatar from '../components/CustomShapedAvatar';
import { profileAPI } from '../services/api';

export default function Profile() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Animation values
  const glowAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Get role from route params or default to 'regular'
  const [userRole, setUserRole] = useState(route.params?.role || 'regular');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [interests, setInterests] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showInterestsList, setShowInterestsList] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Sample interests list
  const interestsList = [
    'Music', 'Sports', 'Technology', 'Art', 'Fashion', 'Food', 'Travel', 
    'Gaming', 'Movies', 'Books', 'Photography', 'Fitness', 'Dance', 'Cooking',
    'Others'
  ];
  
  // Pro-specific fields
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [portfolio, setPortfolio] = useState('');
  
  // Business-specific fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [employees, setEmployees] = useState('');
  const [website, setWebsite] = useState('');

  // Animate glow effect and title
  useEffect(() => {
    // Animate glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
    
    // Animate title fade in
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  }, []);

  // Check if all required fields are filled based on user role
  const checkFormCompletion = (bioText, skillsText, experienceText, companyNameText, industryText) => {
    const wasFormIncomplete = !bio || 
      (userRole === 'pro' && (!skills || !experience)) || 
      (userRole === 'business' && (!companyName || !industry));
      
    const isFormComplete = 
      bioText && 
      (userRole !== 'pro' || (skillsText && experienceText)) &&
      (userRole !== 'business' || (companyNameText && industryText));
      
    // Only animate if form was previously incomplete and is now complete
    if (wasFormIncomplete && isFormComplete) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Handle location input and suggestions
  const handleLocationChange = (text) => {
    setLocation(text);
    if (text.length > 1) {
      // First show nearby locations (based on IP)
      const nearbyLocations = [
        'New York, USA',
        'San Francisco, USA'
      ].filter(loc => loc.toLowerCase().includes(text.toLowerCase()));
      
      // Then show other matching locations
      const otherLocations = [
        'London, UK',
        'Los Angeles, USA',
        'Liverpool, UK',
        'Lyon, France',
        'Lisbon, Portugal',
        'Seattle, USA',
        'Chicago, USA'
      ].filter(loc => loc.toLowerCase().includes(text.toLowerCase()));
      
      // Combine with nearby locations first
      setLocationSuggestions([...nearbyLocations, ...otherLocations.slice(0, 3)]);
    } else {
      // Clear suggestions if input is too short
      setLocationSuggestions([]);
    }
  };

  // Handle interest selection
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
    setInterests(selectedInterests.join(', '));
  };
  
  // Handle profile image selection
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
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  const handleComplete = async () => {
    if (!bio) {
      Alert.alert('Error', 'Please fill in your Klaapeline');
      return;
    }

    if (userRole === 'pro' && (!skills || !experience)) {
      Alert.alert('Error', 'Please complete your professional profile');
      return;
    }
    
    if (userRole === 'business' && (!companyName || !industry)) {
      Alert.alert('Error', 'Please complete your business profile');
      return;
    }

    try {
      setLoading(true);
      
      const profileData = {
        displayName,
        bio,
        location,
        interests: selectedInterests.join(', '),
        role: userRole,
        updatedAt: new Date().toISOString()
      };

      // Add pro-specific data
      if (userRole === 'pro') {
        profileData.skills = skills;
        profileData.experience = experience;
        profileData.hourlyRate = hourlyRate;
        profileData.portfolio = portfolio;
        profileData.isVerifiedPro = false; // Will be verified later
      }
      
      // Add business-specific data
      if (userRole === 'business') {
        profileData.companyName = companyName;
        profileData.industry = industry;
        profileData.employees = employees;
        profileData.website = website;
        profileData.isVerifiedBusiness = false; // Will be verified later
      }

      // In a real app, this would call the API
      // await profileAPI.updateProfile('user-id', profileData);
      
      // For demo purposes, just show success and navigate to profile picture
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('ProfilePicture', { role: userRole });
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to create profile');
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/splash-icon.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.progressIndicator}>
            <Animated.View 
              style={[
                styles.progressDot, 
                styles.activeDot,
                {opacity: glowAnim}
              ]} 
            />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
          
          <Animated.Text style={[styles.title, {opacity: titleAnim}]}>
            {userRole === 'pro' 
              ? 'Pro Creator Profile'
              : userRole === 'business'
                ? 'Business Profile'
                : 'Complete Your Profile'
            }
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, {opacity: titleAnim}]}>
            {userRole === 'pro' 
              ? 'Set up your professional profile to start earning'
              : userRole === 'business'
                ? 'Set up your business profile'
                : 'Tell us a bit about yourself'
            }
          </Animated.Text>

          {/* Profile Picture */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage}>
              <CustomShapedAvatar 
                imageUri={imageUri}
                userRole={userRole}
                size={150}
              />
              <View style={styles.addPhotoButton}>
                <Text style={styles.addPhotoText}>
                  {imageUri ? 'Change Photo' : 'Add Photo'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Basic fields for all users */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={[
                styles.input,
                userRole === 'pro' ? styles.proInput : 
                userRole === 'business' ? styles.businessInput : 
                styles.regularInput
              ]}
              placeholder="Your name or username"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={displayName}
              onChangeText={setDisplayName}
              maxLength={30}
            />
            {displayName.length > 0 && (
              <Text style={styles.charCount}>{displayName.length}/30</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Klaapeline *</Text>
            <TextInput
              style={[
                styles.input, 
                styles.textArea,
                userRole === 'pro' ? styles.proInput : 
                userRole === 'business' ? styles.businessInput : 
                styles.regularInput
              ]}
              placeholder="Tell the world about yourself in a few words..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={bio}
              onChangeText={(text) => {
                setBio(text);
                checkFormCompletion(text, skills, experience, companyName, industry);
              }}
              multiline
              numberOfLines={3}
              maxLength={150}
            />
            <Text style={styles.exampleText}>Example: "Creative photographer with a passion for urban landscapes"</Text>
            {bio.length > 0 && (
              <Text style={styles.charCount}>{bio.length}/150</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[
                styles.input,
                styles.locationInput,
                userRole === 'pro' ? styles.proInput : 
                userRole === 'business' ? styles.businessInput : 
                styles.regularInput
              ]}
              placeholder="Type your location"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={location}
              onChangeText={handleLocationChange}
            />
          </View>
          
          {locationSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>Suggestions</Text>
              </View>
              
              {locationSuggestions.slice(0, 2).map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.suggestionItem, styles.nearbySuggestion]}
                  onPress={() => {
                    setLocation(item);
                    setLocationSuggestions([]);
                  }}
                >
                  <Text style={styles.suggestionText}>📍 {item}</Text>
                  <Text style={styles.nearbyLabel}>NEARBY</Text>
                </TouchableOpacity>
              ))}
              
              {locationSuggestions.slice(2).map((item, index) => (
                <TouchableOpacity 
                  key={index + 2} 
                  style={styles.suggestionItem}
                  onPress={() => {
                    setLocation(item);
                    setLocationSuggestions([]);
                  }}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Interests</Text>
            <TouchableOpacity
              style={[
                styles.input,
                styles.interestInput,
                userRole === 'pro' ? styles.proInput : 
                userRole === 'business' ? styles.businessInput : 
                styles.regularInput
              ]}
              onPress={() => setShowInterestsList(!showInterestsList)}
            >
              <Text style={selectedInterests.length > 0 ? styles.inputText : styles.placeholderText}>
                {selectedInterests.length > 0 ? selectedInterests.join(', ') : 'Select your interests...'}
              </Text>
            </TouchableOpacity>
            
            {showInterestsList && (
              <View style={styles.interestsContainer}>
                <View style={styles.interestsHeader}>
                  <Text style={styles.interestsHeaderText}>Select Interests</Text>
                  {selectedInterests.length > 0 && (
                    <TouchableOpacity 
                      style={styles.clearButton}
                      onPress={() => {
                        setSelectedInterests([]);
                        setInterests('');
                      }}
                    >
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.interestsGrid}>
                  {interestsList.map((item) => (
                    <TouchableOpacity 
                      key={item}
                      style={[
                        styles.interestItem,
                        selectedInterests.includes(item) && styles.selectedInterest
                      ]}
                      onPress={() => toggleInterest(item)}
                    >
                      <Text style={[
                        styles.interestText,
                        selectedInterests.includes(item) && styles.selectedInterestText
                      ]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Pro-specific fields */}
          {userRole === 'pro' && (
            <>
              <Text style={[styles.sectionTitle, {color: '#FF00FF'}]}>👑 Professional Details</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Skills & Expertise *</Text>
                <TextInput
                  style={[styles.input, styles.textArea, styles.proInput]}
                  placeholder="What are you good at? (e.g., Cooking, Fitness, Music)"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={skills}
                  onChangeText={(text) => {
                    setSkills(text);
                    checkFormCompletion(bio, text, experience, companyName, industry);
                  }}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Experience *</Text>
                <TextInput
                  style={[styles.input, styles.proInput]}
                  placeholder="Years of experience"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={experience}
                  onChangeText={(text) => {
                    setExperience(text);
                    checkFormCompletion(bio, skills, text, companyName, industry);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Hourly Rate (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.proInput]}
                  placeholder="$25/hour"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Portfolio/Website</Text>
                <TextInput
                  style={[styles.input, styles.proInput]}
                  placeholder="https://yourwebsite.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={portfolio}
                  onChangeText={setPortfolio}
                  autoCapitalize="none"
                />
              </View>
            </>
          )}
          
          {/* Business-specific fields */}
          {userRole === 'business' && (
            <>
              <Text style={[styles.sectionTitle, {color: '#FFD700'}]}>🏢 Business Details</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Company Name *</Text>
                <TextInput
                  style={[styles.input, styles.businessInput]}
                  placeholder="Your company name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={companyName}
                  onChangeText={(text) => {
                    setCompanyName(text);
                    checkFormCompletion(bio, skills, experience, text, industry);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Industry *</Text>
                <TextInput
                  style={[styles.input, styles.businessInput]}
                  placeholder="e.g., Technology, Healthcare, Education"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={industry}
                  onChangeText={(text) => {
                    setIndustry(text);
                    checkFormCompletion(bio, skills, experience, companyName, text);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Number of Employees</Text>
                <TextInput
                  style={[styles.input, styles.businessInput]}
                  placeholder="e.g., 1-10, 11-50, 51-200"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={employees}
                  onChangeText={setEmployees}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Company Website</Text>
                <TextInput
                  style={[styles.input, styles.businessInput]}
                  placeholder="https://yourcompany.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={website}
                  onChangeText={setWebsite}
                  autoCapitalize="none"
                />
              </View>
            </>
          )}

          <View style={styles.buttonsRow}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  userRole === 'pro' && styles.proButton,
                  userRole === 'business' && styles.businessButton,
                  (!bio || 
                   (userRole === 'pro' && (!skills || !experience)) || 
                   (userRole === 'business' && (!companyName || !industry))
                  ) && styles.disabledButton,
                  loading && styles.disabledButton
                ]}
                activeOpacity={0.8}
                onPress={handleComplete}
                disabled={!bio || 
                         (userRole === 'pro' && (!skills || !experience)) || 
                         (userRole === 'business' && (!companyName || !industry)) ||
                         loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.continueText}>Complete Profile</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity 
              style={styles.skipContainer}
              onPress={() => navigation.navigate('Home')}
              disabled={loading}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%',
    height: '100%'
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'rgba(10, 0, 21, 0.85)'
  },
  scrollViewContent: { 
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100, // Increased padding at bottom to ensure content is visible
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%'
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#fff', 
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10
  },
  subtitle: { 
    fontSize: 15, 
    color: 'rgba(255, 255, 255, 0.7)', 
    marginBottom: 32,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addPhotoButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  input: { 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 15, 
    color: '#fff',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#9747FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3
  },
  locationInput: {
    height: 48,
  },
  interestInput: {
    height: 48,
  },
  proInput: {
    borderColor: 'rgba(255, 20, 147, 0.8)',
    borderWidth: 1.5,
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  businessInput: {
    borderColor: 'rgba(255, 215, 0, 0.8)',
    borderWidth: 1.5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  regularInput: {
    borderWidth: 1.5,
    borderColor: 'rgba(151, 71, 255, 0.8)',
    shadowColor: '#9747FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top'
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 10
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 6,
    shadowColor: '#9747FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5
  },
  suggestionsContainer: {
    marginTop: -12,
    marginBottom: 12,
    backgroundColor: 'rgba(20, 10, 30, 0.98)',
    borderRadius: 12,
    zIndex: 10,
    maxHeight: 180,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(151, 71, 255, 0.4)',
    shadowColor: '#9747FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nearbySuggestion: {
    backgroundColor: 'rgba(151, 71, 255, 0.25)'
  },
  suggestionText: {
    color: 'white',
    fontSize: 14,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3
  },
  nearbyLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(151, 71, 255, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  suggestionsHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  suggestionsTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  interestsContainer: {
    backgroundColor: 'rgba(30, 20, 40, 0.95)',
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(151, 71, 255, 0.4)',
    maxHeight: 200,
    shadowColor: '#9747FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5
  },
  interestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  interestsHeaderText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  clearButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '500'
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: 8
  },
  interestItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 3,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60
  },
  selectedInterest: {
    backgroundColor: 'rgba(151, 71, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#9747FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5
  },
  interestText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 11,
    paddingHorizontal: 2
  },
  selectedInterestText: {
    fontWeight: 'bold'
  },
  inputText: {
    color: 'white',
    fontSize: 15,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3
  },
  charCount: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4
  },
  exampleText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
    textShadowColor: 'rgba(151, 71, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
    width: '100%'
  },
  continueButton: {
    backgroundColor: "#FFD700",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 80,
    marginRight: 15,
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
  proButton: {
    backgroundColor: "#FF00FF",
    ...Platform.select({
      ios: {
        shadowColor: "#FF00FF",
      },
      web: {
        boxShadow: '0 0 25px rgba(255, 0, 255, 0.8)',
      },
    }),
  },
  businessButton: {
    backgroundColor: "#F5B800",
    ...Platform.select({
      ios: {
        shadowColor: "#F5B800",
      },
      web: {
        boxShadow: '0 0 25px rgba(245, 184, 0, 0.8)',
      },
    }),
  },
  continueText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#999",
    opacity: 0.7,
  },
  skipContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500'
  }
});