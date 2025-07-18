import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons"; // Assuming you are using Expo for icons
import { useNavigation } from "@react-navigation/native";
// Main App component for the login screen
export default function SignUp() {
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false); // State for the checkbox

  // Placeholder function for button presses
  const handlePress = (buttonName) => {
    console.log(`${buttonName} pressed!`);
    // In a real app, you would navigate or perform authentication logic here.
  };

  return (
    <ImageBackground
      source={require("../assets/signUp.jpg")} // Placeholder for background image
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top left icon */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#3F51B5" />
        </TouchableOpacity>

        <View style={styles.container}>
          {/* Main content card */}
          <View style={styles.card}>
            {/* Login title */}
            <Image
              source={require("../assets/penguin.png")}
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
                marginBottom: 10,
              }}
            />
            <Text style={styles.title}>Sign Up to Neoping</Text>

            {/* Email or Username Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email or username"
                placeholderTextColor="#999"
                value={emailUsername}
                onChangeText={setEmailUsername}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordVisibilityToggle}
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Log in Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.replace("MainTabs")}
            >
              <Text style={styles.loginButtonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={styles.checkbox}
              >
                {isChecked ? (
                  <AntDesign name="checksquare" size={20} color="#3F51B5" />
                ) : (
                  <AntDesign name="checksquareo" size={20} color="#888" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                I agree to receive emails about cool stuff on
              </Text>
            </View>

            <Text style={styles.legalText}>
              By continuing, you agree to our{" "}
              <Text
                style={styles.linkText}
                onPress={() => handlePress("User Agreement")}
              >
                User Agreement
              </Text>{" "}
              and acknowledge that you understand the{" "}
              <Text
                style={styles.linkText}
                onPress={() => handlePress("Privacy Policy")}
              >
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
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Or 'stretch'
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0, // Adjust for Android status bar
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    maxWidth: 400, // Max width for larger screens
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3F51B5",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333333",
  },
  passwordVisibilityToggle: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#3F51B5",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  checkbox: {
    marginRight: 10,
    padding: 2,
  },
  checkboxText: {
    fontSize: 13,
    color: "#555555",
    flexShrink: 1, // Allow text to wrap
  },
  legalText: {
    fontSize: 12,
    color: "#777777",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
  },
  linkText: {
    color: "#3F51B5",
    fontWeight: "bold",
  },
  createAccountButton: {
    borderWidth: 1,
    borderColor: "#3F51B5",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  createAccountButtonText: {
    fontSize: 16,
    color: "#3F51B5",
    fontWeight: "500",
  },
});
