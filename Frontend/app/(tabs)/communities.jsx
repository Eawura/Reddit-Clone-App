import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../components/ThemeContext';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { themeColors } = useTheme();

  // Filter communities by search text
  const filteredCommunitiesBySearch = searchText.trim() === '' ? filteredCommunities : filteredCommunities.filter(community => {
    const q = searchText.toLowerCase();
    return (
      community.name.toLowerCase().includes(q) ||
      community.description.toLowerCase().includes(q)
    );
  });

  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

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
        <Text style={[styles.communityName, { color: themeColors.text }]}>n/{item.name}</Text>
        <Text style={styles.communityMembers}>{item.members} members</Text>
        <Text style={styles.communityDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }] }>
      {/* Search Bar */}
      {searchOpen ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 40, backgroundColor: themeColors.background, borderBottomWidth: 1, borderColor: themeColors.border }}>
          <Ionicons name="search" size={22} color={themeColors.icon} style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 18, color: themeColors.text, paddingVertical: 8 }}
            placeholder="Search communities"
            placeholderTextColor={themeColors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={{ marginHorizontal: 4 }}>
              <Ionicons name="close-circle" size={22} color={themeColors.icon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleCancelSearch} style={{ marginLeft: 8 }}>
            <Text style={{ color: themeColors.accent || '#2E45A3', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* Search Bar */}
      {!searchOpen && (
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
      )}
      {/* Communities List */}
      <FlatList
        data={filteredCommunitiesBySearch}
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
    marginBottom: 2,
  },
  communityMembers: {
    fontSize: 14,
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    color: '#444',
  },
});

export default Communities;