import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Create = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(params.community || '');
  const [canPost, setCanPost] = useState(false);

  useEffect(() => {
    setCanPost(title.trim().length > 0 && selectedCommunity);
  }, [title, selectedCommunity]);

  const handlePost = () => {
    if (!canPost) return;
    
    // Simulate post creation
    Alert.alert(
      'Success',
      'Post created successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleSelectCommunity = () => {
    router.push('/(tabs)/communities');
  };

  const handleAttachment = () => {
    Alert.alert('Coming Soon', 'File attachment feature coming soon!');
  };

  const handleAddPhoto = () => {
    Alert.alert('Coming Soon', 'Photo attachment feature coming soon!');
  };

  const handleAddVideo = () => {
    Alert.alert('Coming Soon', 'Video attachment feature coming soon!');
  };

  const handleAddList = () => {
    Alert.alert('Coming Soon', 'List creation feature coming soon!');
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="log-out-outline" size={28} color="#444" style={{ transform: [{ scaleX: -1 }] }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.postButton, !canPost && styles.postButtonDisabled]} 
          disabled={!canPost}
          onPress={handlePost}
        >
          <Text style={[styles.postButtonText, !canPost && styles.postButtonTextDisabled]}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Select Community */}
      <TouchableOpacity 
        style={styles.selectCommunity}
        onPress={handleSelectCommunity}
      >
        <View style={styles.communityIcon}>
          <Text style={styles.communityIconText}>n/</Text>
        </View>
        <Text style={styles.selectCommunityText}>
          {selectedCommunity || 'Select a community'}
        </Text>
      </TouchableOpacity>

      {/* Title Input */}
      <Text style={styles.titleLabel}>Title</Text>
      <TextInput
        style={styles.titleInput}
        placeholder=""
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        maxLength={300}
      />

      {/* Body Input */}
      <TextInput
        style={styles.bodyInput}
        placeholder="body text (optional)"
        placeholderTextColor="#222"
        multiline
        value={body}
        onChangeText={setBody}
        maxLength={40000}
      />

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleAttachment}>
          <Entypo name="attachment" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddPhoto}>
          <MaterialIcons name="add-photo-alternate" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddVideo}>
          <Ionicons name="play-circle-outline" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddList}>
          <FontAwesome5 name="list-ol" size={24} color="#222" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  postButton: {
    backgroundColor: '#3a4bb7',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  postButtonDisabled: {
    backgroundColor: '#ccd0d2',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  postButtonTextDisabled: {
    color: '#888',
  },
  selectCommunity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  communityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  communityIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectCommunityText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  titleLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#666',
    marginLeft: 16,
    marginBottom: 6,
  },
  titleInput: {
    fontSize: 16,
    color: '#222',
    marginHorizontal: 16,
    marginBottom: 18,
    borderBottomWidth: 0,
    fontWeight: '500',
  },
  bodyInput: {
    fontSize: 15,
    color: '#111',
    marginHorizontal: 16,
    marginBottom: 18,
    borderBottomWidth: 0,
    minHeight: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 32,
  },
});

export default Create;