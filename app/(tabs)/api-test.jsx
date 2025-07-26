import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useTheme } from "../../components/ThemeContext";
import { testConnection } from "../../utils/api";

export default function ApiTestScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState({});
  const { themeColors } = useTheme();

  const runApiTests = async () => {
    setLoading(true);
    setError(null);
    const results = {};

    try {
      // === Test 1: Basic Connection ===
      results.connection = "🔄 Checking connection...";
      setTestResults({ ...results });

      const connectionTest = await testConnection();
      if (!connectionTest.success) {
        throw new Error(`Connection failed: ${connectionTest.error}`);
      }
      results.connection = "✅ Backend is reachable";

      // === Test 2: CORS Preflight ===
      const corsTest = await fetch("http://localhost:8082/api/auth/signup", {
        method: "OPTIONS",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (corsTest.ok) {
        results.corsStatus = "✅ CORS is properly configured";
      } else {
        results.corsStatus = `⚠️ CORS response: ${corsTest.status}`;
      }
      setTestResults({ ...results });

      // === Test 3: User Registration & Login ===
      const timestamp = Date.now();
      const testUsername = `testuser_${timestamp}`;
      const testEmail = `${testUsername}@example.com`;
      const testPassword = "Test@123";

      results.registration = "🔄 Registering test user...";
      setTestResults({ ...results });

      const registerRes = await fetch("http://localhost:8082/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: testUsername,
          email: testEmail,
          password: testPassword,
        }),
      });

      if (!registerRes.ok) {
        const err = await registerRes.json();
        throw new Error(
          `Registration failed: ${err.message || "Unknown error"}`
        );
      }
      results.registration = "✅ Test user registered";

      results.login = "🔄 Logging in...";
      setTestResults({ ...results });

      const loginRes = await fetch("http://localhost:8082/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: testUsername,
          password: testPassword,
        }),
      });

      if (!loginRes.ok) {
        const err = await loginRes.json();
        throw new Error(`Login failed: ${err.message || "Unknown error"}`);
      }

      const loginData = await loginRes.json();
      results.login = "✅ Login successful";
      results.token = loginData.token
        ? "🔑 Token received"
        : "⚠️ Token missing";
      results.user = `👤 ${loginData.username || testUsername}`;
      setTestResults({ ...results });

      // Skipped Tests (you can implement later)
      results.getCurrentUser = "⏭️ Skipping user profile fetch";
      results.getPosts = "⏭️ Skipping posts fetch";
      results.summary = "🎉 API integration and auth are working!";
    } catch (err) {
      console.error("API Test Error:", err);
      setError(err.message);
      results.error = `❌ ${err.message}`;
      setTestResults({ ...results });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        API Integration Test
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Run API Tests"
          onPress={runApiTests}
          disabled={loading}
          color={themeColors.accent}
        />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={themeColors.accent}
          style={styles.loader}
        />
      )}

      <View style={styles.resultsContainer}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Test Results:
        </Text>
        {Object.entries(testResults).map(([key, value]) => (
          <View key={key} style={styles.testRow}>
            <Text style={[styles.testName, { color: themeColors.text }]}>
              {key}:
            </Text>
            <Text
              style={[
                styles.testResult,
                {
                  color: value.includes("✅")
                    ? "green"
                    : value.includes("❌")
                    ? "red"
                    : themeColors.text,
                },
              ]}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 20,
  },
  loader: {
    marginVertical: 20,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  testRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 5,
  },
  testName: {
    flex: 1,
    fontWeight: "500",
  },
  testResult: {
    flex: 1,
    textAlign: "right",
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#d32f2f",
  },
});
