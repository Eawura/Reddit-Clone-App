import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock data for communities
const MOCK_COMMUNITIES = [
  { id: '1', name: 'programming', members: '2.1m', description: 'A community for programmers' },
  { id: '2', name: 'gaming', members: '3.5m', description: 'All things gaming' },
  { id: '3', name: 'technology', members: '1.8m', description: 'Tech news and discussions' },
  { id: '4', name: 'science', members: '1.2m', description: 'Scientific discussions' },
  { id: '5', name: 'movies', members: '2.5m', description: 'Movie discussions and reviews' },
];

const Communities = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState(MOCK_COMMUNITIES);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredCommunities(MOCK_COMMUNITIES);
    } else {
      const filtered = MOCK_COMMUNITIES.filter(community =>
        community.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCommunities(filtered);
    }
  };

  const handleCommunitySelect = (community) => {
    Alert.alert(
      'Community Selected',
      `You selected n/${community.name}`,
      [
        {
          text: 'OK',
          onPress: () => router.push({
            pathname: '/(tabs)/create',
            params: { community: community.name }
          })
        }
      ]
    );
  };

  const renderCommunityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.communityItem}
      onPress={() => handleCommunitySelect(item)}
    >
      <View style={styles.communityIcon}>
        <Text style={styles.communityIconText}>n/</Text>
      </View>
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>n/{item.name}</Text>
        <Text style={styles.communityMembers}>{item.members} members</Text>
        <Text style={styles.communityDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Communities List */}
      <FlatList
        data={filteredCommunities}
        renderItem={renderCommunityItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#222',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  communityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  communityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  communityMembers: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    color: '#444',
  },
});

export default Communities;