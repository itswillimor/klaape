import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, KeyboardAvoidingView, Keyboard, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const colors = {
  Primary: '#1B0033',
  Secondary: '#9747FF',
  White: '#FFFFFF',
  Black: '#000000',
};

export default function Auth({ navigation, route }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('');
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const checkUsernameAvailabilityHandler = async (usernameToCheck) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setUsernameStatus('');
      setUsernameSuggestions([]);
      return;
    }

    setUsernameStatus('checking');
    
    // Simulate API call
    setTimeout(() => {
      const isAvailable = Math.random() > 0.5; // Random for demo
      
      if (isAvailable) {
        setUsernameStatus('available');
        setUsernameSuggestions([]);
      } else {
        setUsernameStatus('taken');
        if (firstName && lastName) {
          const suggestions = generateUsernameSuggestions(firstName, lastName);
          setUsernameSuggestions(suggestions);
        }
      }
    }, 500);
  };

  const generateUsernameSuggestions = (firstName, lastName) => {
    if (!firstName || !lastName) return [];
    
    const first = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const last = lastName.toLowerCase().replace(/[^a-z]/g, '');
    
    const suggestions = [
      `${first}${last}`,
      `${first}_${last}`,
      `${first}${last}${Math.floor(Math.random() * 99) + 1}`
    ];
    
    return suggestions;
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    
    if (window.usernameTimeout) {
      clearTimeout(window.usernameTimeout);
    }
    
    window.usernameTimeout = setTimeout(() => {
      checkUsernameAvailabilityHandler(text);
    }, 0);
  };

  const selectSuggestion = (suggestion) => {
    setUsername(suggestion);
    checkUsernameAvailabilityHandler(suggestion);
    setUsernameSuggestions([]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    if (isLogin) {
      if (!loginUsername || !password) {
        Alert.alert('Error', 'Please enter your username and password');
        setIsLoading(false);
        return;
      }
      
      // Simulate login
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Logged in successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('RoleSelection') }
        ]);
      }, 1000);
    } else {
      if (!username || !firstName || !lastName || !email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        setIsLoading(false);
        return;
      }
      
      if (!agreeToTerms) {
        Alert.alert('Error', 'Please agree to Terms and Conditions');
        setIsLoading(false);
        return;
      }
      
      // Simulate signup
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('RoleSelection') }
        ]);
      }, 1000);
    }
  };

  const scrollViewRef = useRef(null);
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? 'Klaape In' : 'Join Klaape'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome back to the community' : 'Start your Klaapening journey'}
            </Text>
          </View>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <>
                <View style={styles.nameRow}>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="First name"
                      placeholderTextColor="#A0A0A0"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  
                  <View style={styles.spacer} />
                  
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Last name"
                      placeholderTextColor="#A0A0A0"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <View style={styles.usernameContainer}>
                    <TextInput
                      style={[
                        styles.input,
                        usernameStatus === 'available' && styles.inputAvailable,
                        usernameStatus === 'taken' && styles.inputTaken
                      ]}
                      placeholder="Enter your username"
                      placeholderTextColor="#A0A0A0"
                      value={username}
                      onChangeText={handleUsernameChange}
                      autoCapitalize="none"
                    />
                    {usernameStatus === 'checking' && (
                      <Text style={styles.usernameStatus}>Checking...</Text>
                    )}
                    {usernameStatus === 'available' && (
                      <Text style={styles.usernameAvailable}>✓ Available</Text>
                    )}
                    {usernameStatus === 'taken' && (
                      <Text style={styles.usernameTaken}>✗ Username taken</Text>
                    )}
                  </View>
                  
                  {usernameSuggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      <Text style={styles.suggestionsTitle}>Try these instead:</Text>
                      <View style={styles.suggestionsRow}>
                        {usernameSuggestions.map((suggestion, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.suggestionButton}
                            onPress={() => selectSuggestion(suggestion)}
                          >
                            <Text style={styles.suggestionText}>{suggestion}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}
            
            {isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#A0A0A0"
                  value={loginUsername}
                  onChangeText={setLoginUsername}
                  autoCapitalize="none"
                />
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {!isLogin && (
              <TouchableOpacity 
                style={styles.termsContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                <View style={[styles.checkbox, agreeToTerms && styles.checkedBox]}>
                  {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to the Terms and Conditions
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.button} 
              disabled={isLoading}
              onPress={handleSubmit}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.White} size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Klaape In' : 'Join Klaape'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {showDatePicker && !isLogin && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.White 
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100
  },
  content: { 
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40
  },
  header: {
    marginBottom: 40,
    alignItems: 'center'
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: colors.Primary, 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666666', 
    lineHeight: 24 
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8
  },
  activeToggle: {
    backgroundColor: colors.Primary
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666'
  },
  activeToggleText: {
    color: colors.White
  },
  form: {
    flex: 1
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.Primary,
    marginBottom: 8
  },
  input: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 16, 
    fontSize: 16, 
    color: colors.Black,
    borderWidth: 1,
    borderColor: '#E9ECEF'
  },
  button: { 
    backgroundColor: colors.Primary, 
    borderRadius: 12, 
    paddingVertical: 16, 
    marginTop: 24,
    shadowColor: colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56
  },
  buttonText: { 
    color: colors.White, 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.Primary,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkedBox: {
    backgroundColor: colors.Primary
  },
  checkmark: {
    color: colors.White,
    fontSize: 14,
    fontWeight: 'bold'
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    flex: 1
  },
  dateButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF'
  },
  dateText: {
    fontSize: 16,
    color: colors.Black
  },
  usernameContainer: {
    position: 'relative'
  },
  inputAvailable: {
    borderColor: '#28a745'
  },
  inputTaken: {
    borderColor: '#dc3545'
  },
  usernameStatus: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4
  },
  usernameAvailable: {
    fontSize: 12,
    color: '#28a745',
    marginTop: 4
  },
  usernameTaken: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4
  },
  suggestionsContainer: {
    marginTop: 8
  },
  suggestionsTitle: {
    fontSize: 12,
    color: colors.Primary,
    marginBottom: 8,
    fontWeight: '500'
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  suggestionButton: {
    backgroundColor: colors.Primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.Primary + '40'
  },
  suggestionText: {
    fontSize: 14,
    color: colors.Primary,
    fontWeight: '500'
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  nameInputContainer: {
    flex: 0.48,
    marginHorizontal: 0
  },
  spacer: {
    width: 12
  }
});