import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

/**
 * CustomShapedAvatar - A simplified component that renders profile pictures
 * 
 * @param {Object} props
 * @param {string} props.imageUri - URI of the profile image
 * @param {string} props.userRole - User role ('regular', 'pro', or 'business')
 * @param {number} props.size - Size of the avatar (default: 180)
 */
const CustomShapedAvatar = (props) => {
  const { userRole = 'regular', size = 180 } = props;
  
  // Define colors for different roles
  const colors = {
    regular: '#9747FF',
    pro: '#FF00FF',
    business: '#F5B800'
  };

  // Get the appropriate color based on user role
  const color = colors[userRole] || colors.regular;

  return (
    <View style={[styles.container, { width: size, height: size, borderColor: color }]}>
      <Text style={styles.text}>{userRole.charAt(0).toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff'
  }
});

export default CustomShapedAvatar;
