import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, SafeAreaView, Platform, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Assuming you are using Expo for icons
import { useNavigation } from '@react-navigation/native';

// Main App component for the authentication screen
export default function AuthScreen() {
  const [isChecked, setIsChecked] = useState(false); // State for the checkbox
  const navigation = useNavigation()

  // Placeholder function for button presses
  const handlePress = (buttonName) => {
    console.log(`${buttonName} pressed!`);
    // In a real app, you would navigate or perform authentication logic here.
  };

  return (
    <ImageBackground
      source={require('../assets/signUp.jpg')} // Placeholder for background image
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top left icon */}
        <TouchableOpacity style={styles.backButton} onPress={() => {navigation.goBack()}}>
          <AntDesign name="arrowleft" size={24} color="#3F51B5" />
        </TouchableOpacity>

        <View style={styles.container}>
          {/* Main content card */}
          <View style={styles.card}>
            <Image source={require('../assets/penguin.png')} style={{ width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 }}/>
            {/* Login/Sign up title */}
            <Text style={styles.title}>
              Log in or Sign up{'\n'}To Get Started
            </Text>

            {/* Continue with Google Button */}
            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              onPress={() => handlePress('Continue with Google')}
            >
              {/* Using AntDesign for Google icon, replace with actual Google icon if needed */}
              <Image source={require('../assets/icons_google.png')} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Continue with Apple Button */}
            {/* Using AntDesign for Apple icon, replace with actual Apple icon if needed */}
            {/* <TouchableOpacity
              style={[styles.button, styles.appleButton]}
              onPress={() => handlePress('Continue with Apple')}
            >
              
              <AntDesign name="apple1" size={20} color="black" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Continue with Apple</Text>
            </TouchableOpacity> */}

            {/* Use email or username Button */}
            <TouchableOpacity
              style={[styles.button, styles.emailButton]}
              onPress={() => navigation.navigate("Login")}
            >
              {/* Using AntDesign for Lock icon */}
              <AntDesign name="lock" size={20} color="black" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Use email or username</Text>
            </TouchableOpacity>

            {/* Checkbox and legal text */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkbox}>
                {isChecked ? (
                  <AntDesign name="checksquare" size={20} color="#3F51B5" />
                ) : (
                  <AntDesign name="checksquareo" size={20} color="#888" />
                  
                )}
                
                <Text style={styles.checkboxText}>
                I agree to receive emails about cool stuff on Neoping
              </Text>
              </TouchableOpacity>
              
            </View>

            <Text style={styles.legalText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText} onPress={() => handlePress('User Agreement')}>
                User Agreement
              </Text>{' '}
              and acknowledge that you understand the{' '}
              <Text style={styles.linkText} onPress={() => handlePress('Privacy Policy')}>
                Privacy Policy.
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Stylesheet for the components
export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Or 'stretch'
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for Android status bar
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 60, // Position relative to safe area
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400, // Max width for larger screens
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F51B5',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  googleButton: {
    backgroundColor: '#FFFFFF', // White background
  },
  appleButton: {
    backgroundColor: '#FFFFFF', // White background
  },
  emailButton: {
    backgroundColor: '#FFFFFF', // White background
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  checkboxContainer: {
    
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  checkbox: {
    flexDirection: 'row',
    marginRight: 10,
    padding: 2,
  },
  checkboxText: {
    fontSize: 13,
    color: '#555555',
    flexShrink: 1, // Allow text to wrap
    marginRight: 10
  },
  legalText: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
  linkText: {
    color: '#3F51B5',
    fontWeight: 'bold',
  },
});

