import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Step 1: Create your Profile',
    description: 'Set up your profile to share your interests and connect with others.',
    image: require('../assets/pana.png'), // Replace with your image
  },
  {
    id: '2',
    title: 'Step 2: Join Communities',
    description: 'Explore and join communities that match your interests.',
    image: require('../assets/br.png'),
  },
  {
    id: '3',
    title: 'Step 3: Engage with Content',
    description: 'Participate in discussions, comment on posts, and share your thoughts.',
    image: require('../assets/bro2.png'),
  },
  {
    id: '4',
    title: 'Step 4: Create your own post',
    description: 'Share your creativity, opinions, or experience within the community.',
    image: require('../assets/aa.png'),
  },
];

export default function OnboardingScreen({navigation}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleSkip = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: onboardingData.length - 1 });
    }
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
    </View>
  );

  return (
      <View style={styles.container}>
        <Image source={require("../assets/penguin.png")} style={styles.logoimg}/>
      <FlatList
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
      />

      {/* Dots */}
      <View style={styles.dots}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        {currentIndex < onboardingData.length - 1 ? (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
          style={styles.getStarted}
          onPress={() => navigation.navigate("Auth")}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },
  item: {
    width,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: 300,
    marginBottom: 30,
  },
  logoimg:{
    width: 150,
    height: 150,
    marginTop: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#222',
  },
  desc: {
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#555',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#3b82f6',
    width: 12,
    height: 12,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  skip: {
    fontSize: 20,
    color: '#666',
  },
  getStarted: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
  },
});