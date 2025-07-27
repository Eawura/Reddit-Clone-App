import MaskedView from "@react-native-masked-view/masked-view";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import storage from "../utils/storage";

const APP_NAME = "Neoping";
const TYPEWRITER_DELAY = 160;
const NAME_APPEAR_DELAY = 2200;
const TOTAL_SPLASH_TIME = 5000;

export default function SplashScreen() {
  const [typedName, setTypedName] = useState("");
  const router = useRouter();
  const typingTimeouts = useRef([]);

  useEffect(() => {
    const checkNavigation = async () => {
      const isOnboarded = await storage.getOnboardingStatus();
      const isAuthenticated = await storage.getAuthStatus();

      const startTimeout = setTimeout(() => {
        for (let i = 1; i <= APP_NAME.length; i++) {
          typingTimeouts.current.push(
            setTimeout(() => {
              setTypedName((prev) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                return APP_NAME.slice(0, i);
              });
            }, TYPEWRITER_DELAY * i)
          );
        }
      }, NAME_APPEAR_DELAY);

      const navTimeout = setTimeout(() => {
        if (!isOnboarded) {
          router.replace("/onboarding");
        } else if (!isAuthenticated) {
          router.replace("/auth/auth");
        } else {
          router.replace("/(tabs)");
        }
      }, TOTAL_SPLASH_TIME);

      return () => {
        clearTimeout(startTimeout);
        clearTimeout(navTimeout);
        typingTimeouts.current.forEach(clearTimeout);
      };
    };

    checkNavigation();
  }, [router]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/SleepingPenguin.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
      <View style={styles.nameContainer} pointerEvents="none">
        <MaskedView
          maskElement={<Text style={styles.gradientText}>{typedName}</Text>}
        >
          <LinearGradient
            colors={["#2E45A3", "#7683F7", "#292F4B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.gradientText, { opacity: 0 }]}>
              {typedName}
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>
    </View>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  nameContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    top: height / 2 + 80,
  },
  gradientText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 16,
    letterSpacing: 1.5,
  },
});
