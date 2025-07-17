import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons'; // Assuming Expo for icons
import { useNavigation } from '@react-navigation/native';

// Community Screen Component
export default function CommunityScreen() {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation()

  // Placeholder function for navigation or actions
  const handlePress = (action) => {
    console.log(`${action} pressed!`);
    // In a real app, you would navigate or perform specific actions here.
    // For a back button, it would typically be navigation.goBack()
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <TouchableOpacity style={styles.backButton} onPress={() =>navigation.goBack() }>
          <AntDesign name="arrowleft" size={24} color="#3F51B5" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Post to</Text>
        {/* Empty view to push title to center */}
        <View style={styles.backButton} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a community"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Information Text */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Not sure what to search for?</Text>
        <Text style={styles.infoText}>
          There is a community for just about everything on Neoping byt if you're not sure where you should post, try browsing communities by topic first.
        </Text>
        <TouchableOpacity onPress={() => handlePress('Browse communities')}>
          <Text style={styles.browseLink}>Browse communities</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Stylesheet for the components
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0E8F8', // Light blue background matching previous designs
    paddingTop: Platform.OS === 'android' ? 30 : 0, // Adjust for Android status bar
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginTop: 30,
  },
  backButton: {
    padding: 5,
    borderRadius: 50, // To make it circular if needed for a specific icon
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1, // Allow title to take available space
    textAlign: 'center', // Center the title
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333333',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 50, // Adjust as needed
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  browseLink: {
    fontSize: 16,
    color: '#3F51B5',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
