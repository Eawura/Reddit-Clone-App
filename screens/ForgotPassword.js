// ForgotPasswordScreen.js
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { AntDesign, Feather } from "@expo/vector-icons"; // Assuming you are using Expo for icons

export default function ForgotPasswordScreen() {
    const navigation=useNavigation()
  return (
    <View style={styles.container}>
      {/* Top Icons */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#3F51B5" />
        </TouchableOpacity>


      {/* Overlay Card */}
      <View style={styles.card}> 
          <Image
            source={require('../assets/penguin.png')}
            style={styles.penguinImage}
          />

        <Text style={styles.title}>
          Forgot <Text style={styles.highlight}>password</Text>?
        </Text>

        <Text style={styles.description}>
          Enter your email address or username and we'll send you a link to reset your password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email or username"
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={()=> console.log("Reset Password")}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6EBF5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
     position: "absolute",
     top: Platform.OS === "android" ? 40 : 60, // Position relative to safe area
     left: 20,
     zIndex: 1,
     backgroundColor: "rgba(255, 255, 255, 0.7)",
     borderRadius: 50,
     padding: 8,
     alignItems: "center",
     justifyContent: "center",
   },
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#EEF3FF',
    borderRadius: 30,
    padding: 12,
    marginBottom: 20,
  },
  penguinImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  highlight: {
    color: '#3366FF',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#F5F8FF',
    borderRadius: 25,
    padding: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#3366FF',
    borderRadius: 25,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  iconText: {
    fontSize: 22,
  },
});

