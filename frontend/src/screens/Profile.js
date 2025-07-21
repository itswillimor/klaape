import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ImageBackground, Animated, KeyboardAvoidingView, Platform } from 'react-native';

export default function Profile({ navigation, route }) {
  // Animation values
  const glowAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
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

  // Get role from route params or default to 'regular'
  const [userRole, setUserRole] = useState(route.params?.role || 'regular');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  
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
      const profileData = {
        displayName,
        bio,
        location,
        interests,
        updatedAt: new Date().toISOString()
      };

      // Add pro-specific data
      if (userRole === 'pro') {
        profileData.skills = skills;
        profileData.experience = experience;
        profileData.hourlyRate = hourlyRate;
        profileData.portfolio = portfolio;
        profileData.isVerifiedPro = false;
      }
      
      // Add business-specific data
      if (userRole === 'business') {
        profileData.companyName = companyName;
        profileData.industry = industry;
        profileData.employees = employees;
        profileData.website = website;
        profileData.isVerifiedBusiness = false;
      }

      // In a real app, you would save this data
      console.log('Profile data:', profileData);
      
      // Navigate to next screen (you can change this to your next screen)
      Alert.alert('Success', 'Profile completed successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const backgroundImage = Platform.OS === 'web' 
    ? { uri: "https://ik.imagekit.io/ynb2ey9lj/91806EDD-48C9-4CDF-87D5-31258DF4FA26.png?updatedAt=1752849536100" }
    : { uri: "https://ik.imagekit.io/ynb2ey9lj/91806EDD-48C9-4CDF-87D5-31258DF4FA26.png?updatedAt=1752849536100" };

  return (
    <ImageBackground 
      source={backgroundImage}
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
              placeholder="City, Country"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Interests</Text>
            <TextInput
              style={[
                styles.input,
                styles.interestInput,
                userRole === 'pro' ? styles.proInput : 
                userRole === 'business' ? styles.businessInput : 
                styles.regularInput
              ]}
              placeholder="Music, Sports, Tech..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={interests}
              onChangeText={setInterests}
            />
          </View>

          {/* Pro-specific fields */}
          {userRole === 'pro' && (
            <>
              <Text style={[styles.sectionTitle, {color: '#FF00FF'}]}>👑 Professional Details</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Skills & Expertise *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What are you good at? (e.g., Cooking, Fitness, Music)"
                  placeholderTextColor="#A0A0A0"
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
                  style={styles.input}
                  placeholder="Years of experience"
                  placeholderTextColor="#A0A0A0"
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
                  style={styles.input}
                  placeholder="$25/hour"
                  placeholderTextColor="#A0A0A0"
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Portfolio/Website</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://yourwebsite.com"
                  placeholderTextColor="#A0A0A0"
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
                  style={styles.input}
                  placeholder="Your company name"
                  placeholderTextColor="#A0A0A0"
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
                  style={styles.input}
                  placeholder="e.g., Technology, Healthcare, Education"
                  placeholderTextColor="#A0A0A0"
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
                  style={styles.input}
                  placeholder="e.g., 1-10, 11-50, 51-200"
                  placeholderTextColor="#A0A0A0"
                  value={employees}
                  onChangeText={setEmployees}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Company Website</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://yourcompany.com"
                  placeholderTextColor="#A0A0A0"
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
                  ) && styles.disabledButton
                ]}
                activeOpacity={0.8}
                onPress={handleComplete}
                disabled={!bio || 
                         (userRole === 'pro' && (!skills || !experience)) || 
                         (userRole === 'business' && (!companyName || !industry))}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity 
              style={styles.skipContainer}
              onPress={() => Alert.alert('Skipped', 'Profile setup skipped')}
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
    paddingBottom: 100,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%'
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#FFFFFF', 
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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