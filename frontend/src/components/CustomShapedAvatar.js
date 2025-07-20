import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

/**
 * CustomShapedAvatar - A component that renders profile pictures with different shapes based on user role
 * 
 * @param {Object} props
 * @param {string} props.imageUri - URI of the profile image
 * @param {string} props.userRole - User role ('regular', 'pro', or 'business')
 * @param {number} props.size - Size of the avatar (default: 180)
 */
const CustomShapedAvatar = (props) => {
  const { imageUri, userRole = 'regular', size = 180 } = props;
  
  // Define colors for different roles
  const colors = {
    regular: '#9747FF',
    pro: '#FF00FF',
    business: '#F5B800'
  };

  // Get the appropriate color based on user role
  const color = colors[userRole] || colors.regular;

  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderColor: color,
        shadowColor: color,
      }
    ]}>
      {imageUri ? (
        <Image 
          source={{ uri: imageUri }} 
          style={[styles.image, { width: size - 6, height: size - 6 }]} 
        />
      ) : (
        <Text style={styles.text}>{userRole.charAt(0).toUpperCase()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden'
  },
  image: {
    borderRadius: 17, // Slightly smaller than container to account for border
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff'
  }
});

export default CustomShapedAvatar;