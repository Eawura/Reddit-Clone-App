import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useNews } from '../../components/NewsContext';
import { usePosts } from '../../components/PostContext';
import { useProfile } from '../../components/ProfileContext';
import { useTheme } from '../../components/ThemeContext';

const { width } = Dimensions.get('window');
const { MediaTypeOptions } = ImagePicker;

const Create = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { themeColors } = useTheme();
  const { newsList, setNewsList } = useNews();
  const { profile } = useProfile();
  const { addPost } = usePosts();
  
  // Form state
  const [body, setBody] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(params.community || '');
  const [canPost, setCanPost] = useState(false);
  
  // Media state
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  
  // Poll state
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(3);
  const [pollTitle, setPollTitle] = useState('');
  
  // Link state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  
  // Community selection
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI state
  const [postType, setPostType] = useState('text'); // text, image, video, link, poll
  const [isPosting, setIsPosting] = useState(false);
  const [showPostOptions, setShowPostOptions] = useState(false);
  
  // Sample communities data
  const communities = [
    { name: 'n/AskNeoping', members: '42.1m', icon: '🤔' },
    { name: 'n/funny', members: '41.2m', icon: '😂' },
    { name: 'n/gaming', members: '38.5m', icon: '🎮' },
    { name: 'n/pics', members: '29.8m', icon: '📸' },
    { name: 'n/science', members: '32.1m', icon: '🔬' },
    { name: 'n/worldnews', members: '28.9m', icon: '🌍' },
    { name: 'n/explainlikeimfive', members: '21.3m', icon: '❓' },
    { name: 'n/books', members: '19.7m', icon: '📚' },
    { name: 'n/movies', members: '27.4m', icon: '🎬' },
    { name: 'n/music', members: '25.6m', icon: '🎵' },
  ];

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCanPost(selectedCommunity);
  }, [selectedCommunity]);

  // Helper: List of valid avatar keys
  const validAvatars = [
    'commenter1.jpg', 'commenter2.jpg', 'commenter3.jpg', 'commenter4.jpg', 'commenter5.jpg',
    'commenter6.jpg', 'commenter7.jpg', 'commenter8.jpg', 'commenter9.jpg', 'commenter10.jpg',
    'Penguin.jpg', 'Random.jpg', 'danny-1.webp', 'Ronaldo.jpg', 'Messi.jpg', 'SGA.jpg',
    'Logo-NBA.png', 'curry.jpg', 'fifa logo.jpg', 'Grand.jpeg', 'Ramen.jpeg', 'w1.jpg', 'T1.jpg', 'yu.jpg',
  ];
  function getRandomAvatar() {
    return validAvatars[Math.floor(Math.random() * validAvatars.length)];
  }

  const handlePost = async () => {
    if (!canPost) return;
    setIsPosting(true);
    const avatar = profile.avatar || 'commenter1.jpg';
    const newPost = {
      content: body.trim(),
      user: profile.username || 'u/CurrentUser',
      avatar,
      community: selectedCommunity,
      image: selectedImages[0] ? selectedImages[0] : undefined,
      video: selectedVideo,
      poll: showPoll ? { question: pollTitle, options: pollOptions, duration: pollDuration } : undefined,
      link: showUrlInput ? { url, title: urlTitle } : undefined,
      timestamp: new Date(),
      // upvotes, comments, etc. will be set in addPost
    };
    addPost(newPost);
    setTimeout(() => {
      setIsPosting(false);
      setBody('');
      setSelectedImages([]);
      setSelectedVideo(null);
      setShowPoll(false);
      setShowUrlInput(false);
      setUrl('');
      setUrlTitle('');
      setPollOptions(['', '']);
      setPollTitle('');
      setPostType('text');
      router.push('/(tabs)/');
    }, 500);
  };

  const handleSelectCommunity = () => {
    setShowCommunityModal(true);
  };

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community.name);
    setShowCommunityModal(false);
    setSearchQuery('');
  };

  const handleAddMedia = () => {
    setShowMediaPicker(true);
  };

  const handleTakePhoto = async () => {
    setShowMediaPicker(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
      setPostType('image');
    }
  };

  const handlePickImage = async () => {
    setShowMediaPicker(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages([...selectedImages, ...newImages]);
      setPostType('image');
    }
  };

  const handlePickVideo = async () => {
    setShowMediaPicker(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.VIDEO],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedVideo(result.assets[0].uri);
      setPostType('video');
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    if (newImages.length === 0) {
      setPostType('text');
    }
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    setPostType('text');
  };

  const handleAddPoll = () => {
    setShowPoll(true);
    setPostType('poll');
  };

  const handlePollOptionChange = (text, idx) => {
    const newOptions = [...pollOptions];
    newOptions[idx] = text;
    setPollOptions(newOptions);
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
    }
  };

  const handleRemovePoll = () => {
    setShowPoll(false);
    setPollOptions(['', '']);
    setPollDuration(3);
    setPollTitle('');
    setPostType('text');
  };

  const handleAddLink = () => {
    setShowUrlInput(true);
    setPostType('link');
  };

  const handleRemoveUrlInput = () => {
    setShowUrlInput(false);
    setUrl('');
    setUrlTitle('');
    setPostType('text');
  };

  const handlePostTypeChange = (type) => {
    setPostType(type);
    if (type === 'text') {
      setSelectedImages([]);
      setSelectedVideo(null);
      setShowPoll(false);
      setShowUrlInput(false);
    }
  };

  const renderPostTypeSelector = () => (
    <View style={[styles.postTypeSelector, { backgroundColor: themeColors.card }]}>
      <TouchableOpacity 
        style={[styles.postTypeButton, postType === 'text' && styles.postTypeButtonActive]}
        onPress={() => handlePostTypeChange('text')}
      >
        <Ionicons name="create-outline" size={20} color={postType === 'text' ? '#2E45A3' : themeColors.textSecondary} />
        <Text style={[styles.postTypeText, { color: postType === 'text' ? '#2E45A3' : themeColors.textSecondary }]}>Text</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.postTypeButton, postType === 'image' && styles.postTypeButtonActive]}
        onPress={() => handlePostTypeChange('image')}
      >
        <Ionicons name="image-outline" size={20} color={postType === 'image' ? '#2E45A3' : themeColors.textSecondary} />
        <Text style={[styles.postTypeText, { color: postType === 'image' ? '#2E45A3' : themeColors.textSecondary }]}>Image</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.postTypeButton, postType === 'link' && styles.postTypeButtonActive]}
        onPress={() => handlePostTypeChange('link')}
      >
        <Ionicons name="link-outline" size={20} color={postType === 'link' ? '#2E45A3' : themeColors.textSecondary} />
        <Text style={[styles.postTypeText, { color: postType === 'link' ? '#2E45A3' : themeColors.textSecondary }]}>Link</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.postTypeButton, postType === 'poll' && styles.postTypeButtonActive]}
        onPress={() => handlePostTypeChange('poll')}
      >
        <Ionicons name="list-outline" size={20} color={postType === 'poll' ? '#2E45A3' : themeColors.textSecondary} />
        <Text style={[styles.postTypeText, { color: postType === 'poll' ? '#2E45A3' : themeColors.textSecondary }]}>Poll</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: themeColors.border, paddingTop: Platform.OS === 'ios' ? 56 : 32 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color={themeColors.text} />
        </TouchableOpacity>
        
        <View style={styles.topBarCenter}>
          <Text style={[styles.topBarTitle, { color: themeColors.text }]}>Create Post</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.postButton, !canPost && styles.postButtonDisabled]} 
          disabled={!canPost || isPosting}
          onPress={handlePost}
        >
          {isPosting ? (
            <Text style={[styles.postButtonText, { color: '#fff' }]}>Posting...</Text>
          ) : (
            <Text style={[styles.postButtonText, !canPost && styles.postButtonTextDisabled]}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Type Selector */}
        {renderPostTypeSelector()}

        {/* Select Community */}
        <TouchableOpacity 
          style={[styles.selectCommunity, { backgroundColor: themeColors.card }]}
          onPress={handleSelectCommunity}
        >
          <View style={styles.communityIcon}>
            <Text style={styles.communityIconText}>n/</Text>
          </View>
          <Text style={[styles.selectCommunityText, { color: themeColors.text }]}>
            {selectedCommunity || 'Choose a community'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>

        {/* Body Input */}
        {postType === 'text' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.bodyInput, { color: themeColors.text }]}
              placeholder="What are your thoughts?"
              placeholderTextColor={themeColors.textSecondary}
              multiline
              value={body}
              onChangeText={setBody}
              maxLength={40000}
            />
            <Text style={[styles.charCount, { color: themeColors.textSecondary }]}>
              {body.length}/40000
            </Text>
          </View>
        )}

        {/* Image Display */}
        {postType === 'image' && selectedImages.length > 0 && (
          <View style={styles.mediaContainer}>
            <Text style={[styles.mediaTitle, { color: themeColors.text }]}>Images ({selectedImages.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.selectedImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Video Display */}
        {postType === 'video' && selectedVideo && (
          <View style={styles.mediaContainer}>
            <Text style={[styles.mediaTitle, { color: themeColors.text }]}>Video</Text>
            <View style={styles.videoContainer}>
              <View style={styles.videoPlaceholder}>
                <Ionicons name="play-circle" size={48} color={themeColors.textSecondary} />
                <Text style={[styles.videoText, { color: themeColors.textSecondary }]}>Video selected</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeVideoButton}
                onPress={handleRemoveVideo}
              >
                <Ionicons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Poll */}
        {postType === 'poll' && (
          <View style={[styles.pollContainer, { backgroundColor: themeColors.card }]}>
            <View style={styles.pollHeader}>
              <Text style={[styles.pollTitle, { color: themeColors.text }]}>Poll</Text>
              <TouchableOpacity onPress={handleRemovePoll}>
                <Ionicons name="close" size={24} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.pollQuestionInput, { color: themeColors.text }]}
              placeholder="Ask a question..."
              placeholderTextColor={themeColors.textSecondary}
              value={pollTitle}
              onChangeText={setPollTitle}
            />
            
            {pollOptions.map((option, index) => (
              <View key={index} style={styles.pollOptionContainer}>
                <TextInput
                  style={[styles.pollOptionInput, { color: themeColors.text }]}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor={themeColors.textSecondary}
                  value={option}
                  onChangeText={(text) => handlePollOptionChange(text, index)}
                />
                {pollOptions.length > 2 && (
                  <TouchableOpacity 
                    style={styles.removeOptionButton}
                    onPress={() => handleRemovePollOption(index)}
                  >
                    <Ionicons name="close" size={20} color={themeColors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            {pollOptions.length < 6 && (
              <TouchableOpacity 
                style={[styles.addOptionButton, { borderColor: themeColors.border }]}
                onPress={handleAddPollOption}
              >
                <Ionicons name="add" size={20} color={themeColors.textSecondary} />
                <Text style={[styles.addOptionText, { color: themeColors.textSecondary }]}>Add option</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.pollDurationContainer}>
              <Text style={[styles.pollDurationText, { color: themeColors.text }]}>
                Poll ends in {pollDuration} days
              </Text>
            </View>
          </View>
        )}

        {/* Link Input */}
        {postType === 'link' && (
          <View style={[styles.linkContainer, { backgroundColor: themeColors.card }]}>
            <View style={styles.linkHeader}>
              <Text style={[styles.linkTitle, { color: themeColors.text }]}>Link</Text>
              <TouchableOpacity onPress={handleRemoveUrlInput}>
                <Ionicons name="close" size={24} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.linkInput, { color: themeColors.text }]}
              placeholder="URL"
              placeholderTextColor={themeColors.textSecondary}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            
            <TextInput
              style={[styles.linkInput, { color: themeColors.text }]}
              placeholder="Title (optional)"
              placeholderTextColor={themeColors.textSecondary}
              value={urlTitle}
              onChangeText={setUrlTitle}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom Toolbar */}
      <View style={[styles.bottomBar, { backgroundColor: themeColors.card }]}>
        <TouchableOpacity style={styles.toolbarButton} onPress={handleAddMedia}>
          <Ionicons name="image-outline" size={24} color={themeColors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolbarButton} onPress={handleAddLink}>
          <Ionicons name="link-outline" size={24} color={themeColors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolbarButton} onPress={handleAddPoll}>
          <Ionicons name="list-outline" size={24} color={themeColors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Community Selection Modal */}
      <Modal
        visible={showCommunityModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCommunityModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.communityModal, { backgroundColor: themeColors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: themeColors.border }]}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Choose a community</Text>
              <TouchableOpacity onPress={() => setShowCommunityModal(false)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.searchInput, { color: themeColors.text, backgroundColor: themeColors.card }]}
              placeholder="Search communities"
              placeholderTextColor={themeColors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            <ScrollView style={styles.communityList} showsVerticalScrollIndicator={false}>
              {filteredCommunities.map((community, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.communityItem, { borderBottomColor: themeColors.border }]}
                  onPress={() => handleCommunitySelect(community)}
                >
                  <View style={styles.communityItemIcon}>
                    <Text style={styles.communityItemIconText}>{community.icon}</Text>
                  </View>
                  <View style={styles.communityItemInfo}>
                    <Text style={[styles.communityItemName, { color: themeColors.text }]}>{community.name}</Text>
                    <Text style={[styles.communityItemMembers, { color: themeColors.textSecondary }]}>{community.members} members</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Media Picker Modal */}
      <Modal
        visible={showMediaPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.mediaPickerModal, { backgroundColor: themeColors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: themeColors.border }]}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Add Media</Text>
              <TouchableOpacity onPress={() => setShowMediaPicker(false)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mediaOptions}>
              <TouchableOpacity style={[styles.mediaOption, { backgroundColor: themeColors.card }]} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={32} color={themeColors.text} />
                <Text style={[styles.mediaOptionText, { color: themeColors.text }]}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.mediaOption, { backgroundColor: themeColors.card }]} onPress={handlePickImage}>
                <Ionicons name="images" size={32} color={themeColors.text} />
                <Text style={[styles.mediaOptionText, { color: themeColors.text }]}>Choose Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.mediaOption, { backgroundColor: themeColors.card }]} onPress={handlePickVideo}>
                <Ionicons name="videocam" size={32} color={themeColors.text} />
                <Text style={[styles.mediaOptionText, { color: themeColors.text }]}>Choose Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#2E45A3',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  postButtonTextDisabled: {
    color: '#888',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  postTypeSelector: {
    flexDirection: 'row',
    marginVertical: 16,
    borderRadius: 12,
    padding: 4,
    backgroundColor: 'rgba(46, 69, 163, 0.05)',
  },
  postTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  postTypeButtonActive: {
    backgroundColor: 'rgba(46, 69, 163, 0.15)',
    borderWidth: 1,
    borderColor: '#2E45A3',
    shadowColor: '#2E45A3',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  postTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  selectCommunity: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  communityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E45A3 ',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectCommunityText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  bodyInput: {
    fontSize: 16,
    paddingVertical: 8,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  mediaContainer: {
    marginBottom: 16,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
  },
  videoContainer: {
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: 8,
    fontSize: 16,
  },
  removeVideoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
  },
  pollContainer: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  pollQuestionInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  pollOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pollOptionInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  removeOptionButton: {
    padding: 8,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addOptionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  pollDurationContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pollDurationText: {
    fontSize: 14,
    textAlign: 'center',
  },
  linkContainer: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  linkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  toolbarButton: {
    padding: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  communityModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  mediaPickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchInput: {
    margin: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  communityList: {
    maxHeight: 400,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  communityItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E45A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityItemIconText: {
    fontSize: 20,
  },
  communityItemInfo: {
    flex: 1,
  },
  communityItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  communityItemMembers: {
    fontSize: 14,
    marginTop: 2,
  },
  mediaOptions: {
    padding: 20,
  },
  mediaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  mediaOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
});

export default Create;