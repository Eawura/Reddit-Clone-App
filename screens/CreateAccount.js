// WelcomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Linking,
} from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Assuming you are using Expo for icons
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false); // State for the checkbox
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Top Icons */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="#3F51B5" />
      </TouchableOpacity>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={require("../assets/penguin.png")}
          style={styles.penguinImage}
        />

        <Text style={styles.title}>
          Hi new friend,{"\n"}welcome to{" "}
          <Text style={styles.highlight}>Neoping</Text>
        </Text>

        <Text style={styles.description}>Enter your email to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.checkboxContainer}>
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
            <Text style={styles.checkboxLabel}>
              I agree to receive emails about cool stuff on{" "}
              <Text style={styles.highlight}>Neoping</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our{" "}
          <Text style={styles.link} onPress={() => Linking.openURL("#")}>
            User Agreement
          </Text>{" "}
          and acknowledge that you understand the{" "}
          <Text style={styles.link} onPress={() => Linking.openURL("#")}>
            Privacy Policy
          </Text>
          .
        </Text>

        <TouchableOpacity>
          <Text style={styles.loginText}>Log into existing account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6EBF5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  iconText: {
    fontSize: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 30,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
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
  penguinImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  highlight: {
    color: "#3366FF",
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#F5F8FF",
    borderRadius: 25,
    padding: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    marginLeft: 8,
    color: "#444",
  },
  button: {
    backgroundColor: "#3366FF",
    borderRadius: 25,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  terms: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginBottom: 15,
  },
  link: {
    color: "#3366FF",
    textDecorationLine: "underline",
  },
  loginText: {
    fontSize: 14,
    color: "#3366FF",
    fontWeight: "600",
    marginTop: 10,
  },
});
