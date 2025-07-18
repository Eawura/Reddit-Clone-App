import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { AntDesign, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; // Assuming Expo for icons
import { useNavigation } from '@react-navigation/native';
// Post Screen Component
export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const navigation = useNavigation()

  // Placeholder function for navigation or actions
  const handlePress = (action) => {
    console.log(`${action} pressed!`);
    // In a real app, you would navigate, submit post, or perform other actions here.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#3F51B5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={() => handlePress('Post')}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Select a Community Button */}
      <TouchableOpacity
        style={styles.selectCommunityButton}
        onPress={() => handlePress('Select a community')}
      >
        <MaterialCommunityIcons name="slash-forward" size={20} color="#3F51B5" style={styles.communityIcon} />
        <Text style={styles.selectCommunityText}>Select a community</Text>
      </TouchableOpacity>

      {/* Title Input */}
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />

      {/* Body Text Input */}
      <TextInput
        style={styles.bodyTextInput}
        placeholder="body text (optional)"
        placeholderTextColor="#999"
        value={bodyText}
        onChangeText={setBodyText}
        multiline={true} // Allow multiple lines for body text
        textAlignVertical="top" // Align text to the top for Android
      />

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity style={styles.actionIcon} onPress={() => handlePress('Attach File')}>
          <Feather name="paperclip" size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon} onPress={() => handlePress('Add Image')}>
          <Feather name="image" size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon} onPress={() => handlePress('Add Video')}>
          <Ionicons name="play-outline" size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon} onPress={() => handlePress('Add List')}>
          <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Stylesheet for the components
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1,
    backgroundColor: '#fff', // Light blue background matching previous designs
    paddingTop: Platform.OS === 'android' ? 30 : 0, // Adjust for Android status bar
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginTop: 30,
   
  },
  backButton: {
    padding: 5,
    borderRadius: 50,
  },
  postButton: {
    backgroundColor: '#D0D0D0', // Light grey as in the image
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888', // Grey text
  },
  selectCommunityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  communityIcon: {
    marginRight: 8,
  },
  selectCommunityText: {
    fontSize: 16,
    color: '#3F51B5',
    fontWeight: '500',
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    
  },
  bodyTextInput: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginTop: 15,
    fontSize: 16,
    color: '#333333',
    flex: 1, // Allow it to expand and take available space
    lineHeight: 22,
  
  },
  bottomActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Adjust for iOS safe area
    borderColor: '#E0E8F8',
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, // Shadow on top
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    padding: 10,
  },
});
