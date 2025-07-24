import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const ACCENT = '#2E45A3';
const GRADIENT = ['#e8edfa', '#f5f7fb', '#e8edfa'];

const onboardingData = [
  {
    id: '1',
    title: 'Create your Profile',
    description: 'Set up your profile to share your interests and connect with others.',
    image: require('../../assets/images/onboarding-1.png'),
  },
  {
    id: '2',
    title: 'Join Communities',
    description: 'Explore and join communities that match your interests.',
    image: require('../../assets/images/onboarding-2.png'),
  },
  {
    id: '3',
    title: 'Engage with Content',
    description: 'Participate in discussions, comment on posts, and share your thoughts.',
    image: require('../../assets/images/onboarding-3.png'),
  },
  {
    id: '4',
    title: 'Create your own post',
    description: 'Share your creativity, opinions, or experience within the community.',
    image: require('../../assets/images/onboarding-4.png'),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handleSkip = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: onboardingData.length - 1 });
    }
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={GRADIENT} style={styles.gradient}>
      <View style={styles.logoWrap}>
        <Image source={require('../../assets/images/Penguin.jpg')} style={styles.logoimg}/>
      </View>
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        style={{ flexGrow: 0 }}
      />
      {/* Dots */}
      <View style={styles.dots}>
        {onboardingData.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 24, 10],
            extrapolate: 'clamp',
          });
          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#ccc', ACCENT, '#ccc'],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
            />
          );
        })}
      </View>
      {/* Buttons */}
      <View style={styles.footer}>
        {currentIndex < onboardingData.length - 1 ? (
          <View style={styles.buttonRow}>
            {/* Removed Skip button */}
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
              <AntDesign name="arrowright" size={22} color="#fff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.getStartedModern,
              pressed && { transform: [{ scale: 0.97 }] }
            ]}
            onPress={() => router.replace('/auth/auth')}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
          >
            <LinearGradient
              colors={[ACCENT, '#7683F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.getStartedGradient}
            >
              <Text style={styles.getStartedModernText}>Get Started</Text>
              <AntDesign name="arrowright" size={24} color="#fff" style={{ marginLeft: 10 }} />
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  logoimg: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  card: {
    width: width * 0.88,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 18,
    shadowColor: '#2E45A3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  image: {
    width: '90%',
    height: 220,
    marginBottom: 24,
    borderRadius: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: ACCENT,
    letterSpacing: 0.2,
  },
  desc: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
    color: '#444',
    marginBottom: 4,
    lineHeight: 26,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 30,
    height: 24,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: width * 0.8,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  skip: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  getStarted: {
    backgroundColor: ACCENT,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  getStartedModern: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 8,
  },
  getStartedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 24,
  },
  getStartedModernText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
}); 