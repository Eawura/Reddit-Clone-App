import MaskedView from '@react-native-masked-view/masked-view';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const APP_NAME = 'Neoping';
const TYPEWRITER_DELAY = 160; // ms per character (was 90)
const NAME_APPEAR_DELAY = 2200; // ms before starting typewriter
const TOTAL_SPLASH_TIME = 5000; // ms

export default function SplashScreen() {
  const [typedName, setTypedName] = useState('');
  const router = useRouter();
  const typingTimeouts = useRef([]);

  useEffect(() => {
    // Start typewriter effect after NAME_APPEAR_DELAY
    const startTimeout = setTimeout(() => {
      for (let i = 1; i <= APP_NAME.length; i++) {
        typingTimeouts.current.push(
          setTimeout(() => {
            setTypedName(prev => {
              // Trigger haptic for each letter
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              return APP_NAME.slice(0, i);
            });
          }, TYPEWRITER_DELAY * i)
        );
      }
    }, NAME_APPEAR_DELAY);
    // Navigate after TOTAL_SPLASH_TIME
    const navTimeout = setTimeout(() => {
      router.replace('/onboarding/onboarding');
    }, TOTAL_SPLASH_TIME);
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(navTimeout);
      typingTimeouts.current.forEach(clearTimeout);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/SleepingPenguin.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      {/* Absolutely position the app name below the animation */}
      <View style={styles.nameContainer} pointerEvents="none">
        <MaskedView
          maskElement={
            <Text style={styles.gradientText}>{typedName}</Text>
          }
        >
          <LinearGradient
            colors={["#2E45A3", "#7683F7", "#292F4B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={[styles.gradientText, { opacity: 0 }]}>{typedName}</Text>
          </LinearGradient>
        </MaskedView>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  nameContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    // Place the name a bit below the animation
    top: height / 2 + 80,
  },
  gradientText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 16,
    letterSpacing: 1.5,
  },
}); 