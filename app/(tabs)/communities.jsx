import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../components/ThemeContext";
import {
  createCommunity,
  getCommunities,
  joinCommunity,
  leaveCommunity,
} from "../../utils/api";

// Image mapping for community avatars
const imageMap = {
  "Penguin.jpg": require("../../assets/images/Penguin.jpg"),
  "Commenter1.jpg": require("../../assets/images/Commenter1.jpg"),
  "Commenter2.jpg": require("../../assets/images/Commenter2.jpg"),
  "Commenter3.jpg": require("../../assets/images/Commenter3.jpg"),
  "Commenter4.jpg": require("../../assets/images/Commenter4.jpg"),
  "Commenter5.jpg": require("../../assets/images/Commenter5.jpg"),
  "Commenter6.jpg": require("../../assets/images/Commenter6.jpg"),
  "Commenter7.jpg": require("../../assets/images/Commenter7.jpg"),
  "Commenter8.jpg": require("../../assets/images/Commenter8.jpg"),
  "Commenter9.jpg": require("../../assets/images/Commenter9.jpg"),
  "Commenter10.jpg": require("../../assets/images/Commenter10.jpg"),
};

// Community categories
const COMMUNITY_CATEGORIES = [
  "All",
  "Technology",
  "Entertainment",
  "Education",
  "Lifestyle",
  "Health",
  "Sports",
  "News",
  "Art",
  "Music",
];

// Create Community Modal Component
const CreateCommunityModal = ({
  visible,
  onClose,
  onCommunityCreated,
  themeColors,
}) => {
  const [communityName, setCommunityName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!communityName.trim() || !displayName.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (communityName.length < 3) {
      Alert.alert("Error", "Community name must be at least 3 characters long");
      return;
    }
    if (communityName.includes(" ")) {
      Alert.alert("Error", "Community name cannot contain spaces");
      return;
    }
    setIsLoading(true);
    try {
      const newCommunity = await createCommunity({
        name: communityName.toLowerCase(),
        displayName,
        description,
        category,
        isPublic,
      });
      onCommunityCreated(newCommunity);
      setIsLoading(false);
      onClose();
      setCommunityName("");
      setDisplayName("");
      setDescription("");
      setCategory("Technology");
      setIsPublic(true);
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Error", "Could not create community.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[
          styles.modalContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.modalHeader,
            { borderBottomColor: themeColors.border },
          ]}
        >
          <TouchableOpacity onPress={onClose} disabled={isLoading}>
            <Text style={[styles.cancelButton, { color: themeColors.accent }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>
            Create Community
          </Text>
          <TouchableOpacity
            onPress={handleCreate}
            disabled={isLoading || !communityName.trim() || !displayName.trim()}
          >
            <Text
              style={[
                styles.createButton,
                {
                  color:
                    isLoading || !communityName.trim() || !displayName.trim()
                      ? themeColors.textSecondary
                      : themeColors.accent,
                },
              ]}
            >
              {isLoading ? "Creating..." : "Create"}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Community Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.text }]}>
              Community name *
            </Text>
            <View
              style={[
                styles.nameInputContainer,
                { backgroundColor: themeColors.card },
              ]}
            >
              <Text
                style={[
                  styles.namePrefix,
                  { color: themeColors.textSecondary },
                ]}
              >
                n/
              </Text>
              <TextInput
                style={[styles.nameInput, { color: themeColors.text }]}
                placeholder="community_name"
                placeholderTextColor={themeColors.textSecondary}
                value={communityName}
                onChangeText={setCommunityName}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={21}
              />
            </View>
            <Text
              style={[styles.inputHint, { color: themeColors.textSecondary }]}
            >
              Community names cannot be changed later
            </Text>
          </View>
          {/* Display Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.text }]}>
              Display name *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: themeColors.card, color: themeColors.text },
              ]}
              placeholder="Enter a display name for your community"
              placeholderTextColor={themeColors.textSecondary}
              value={displayName}
              onChangeText={setDisplayName}
              maxLength={100}
            />
          </View>
          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: themeColors.card, color: themeColors.text },
              ]}
              placeholder="Describe your community (optional)"
              placeholderTextColor={themeColors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text
              style={[styles.inputHint, { color: themeColors.textSecondary }]}
            >
              {description.length}/500 characters
            </Text>
          </View>
          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.text }]}>
              Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
            >
              {COMMUNITY_CATEGORIES.slice(1).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: themeColors.card },
                    category === cat && { backgroundColor: themeColors.accent },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          category === cat
                            ? themeColors.background
                            : themeColors.text,
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Privacy Settings */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: themeColors.text }]}>
              Community type
            </Text>
            <View style={styles.privacyContainer}>
              <TouchableOpacity
                style={[
                  styles.privacyOption,
                  { backgroundColor: themeColors.card },
                  isPublic && { backgroundColor: themeColors.accent },
                ]}
                onPress={() => setIsPublic(true)}
              >
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color={
                    isPublic
                      ? themeColors.background
                      : themeColors.textSecondary
                  }
                />
                <View style={styles.privacyTextContainer}>
                  <Text
                    style={[
                      styles.privacyTitle,
                      {
                        color: isPublic
                          ? themeColors.background
                          : themeColors.text,
                      },
                    ]}
                  >
                    Public
                  </Text>
                  <Text
                    style={[
                      styles.privacyDescription,
                      {
                        color: isPublic
                          ? themeColors.background
                          : themeColors.textSecondary,
                      },
                    ]}
                  >
                    Anyone can view, post, and comment
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.privacyOption,
                  { backgroundColor: themeColors.card },
                  !isPublic && { backgroundColor: themeColors.accent },
                ]}
                onPress={() => setIsPublic(false)}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    !isPublic
                      ? themeColors.background
                      : themeColors.textSecondary
                  }
                />
                <View style={styles.privacyTextContainer}>
                  <Text
                    style={[
                      styles.privacyTitle,
                      {
                        color: !isPublic
                          ? themeColors.background
                          : themeColors.text,
                      },
                    ]}
                  >
                    Private
                  </Text>
                  <Text
                    style={[
                      styles.privacyDescription,
                      {
                        color: !isPublic
                          ? themeColors.background
                          : themeColors.textSecondary,
                      },
                    ]}
                  >
                    Only approved users can view and submit
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Community Detail Modal Component
const CommunityDetailModal = ({
  visible,
  onClose,
  community,
  onJoinLeave,
  themeColors,
}) => {
  if (!community) return null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.modalHeader,
            { borderBottomColor: themeColors.border },
          ]}
        >
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelButton, { color: themeColors.accent }]}>
              Close
            </Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>
            Community Info
          </Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Community Header */}
          <View style={styles.communityHeader}>
            <Image
              source={imageMap[community.avatar]}
              style={styles.communityDetailAvatar}
            />
            <View style={styles.communityHeaderInfo}>
              <Text
                style={[
                  styles.communityDetailName,
                  { color: themeColors.text },
                ]}
              >
                n/{community.name}
              </Text>
              <Text
                style={[
                  styles.communityDetailMembers,
                  { color: themeColors.textSecondary },
                ]}
              >
                {community.members} members
              </Text>
              <Text
                style={[
                  styles.communityDetailCategory,
                  { color: themeColors.textSecondary },
                ]}
              >
                {community.category} • Created {community.created}
              </Text>
            </View>
          </View>
          {/* Join/Leave Button */}
          <TouchableOpacity
            style={[
              styles.joinButton,
              {
                backgroundColor: community.isJoined
                  ? themeColors.card
                  : themeColors.accent,
              },
            ]}
            onPress={() => onJoinLeave(community.id)}
          >
            <Text
              style={[
                styles.joinButtonText,
                {
                  color: community.isJoined
                    ? themeColors.text
                    : themeColors.background,
                },
              ]}
            >
              {community.isJoined ? "Joined" : "Join"}
            </Text>
          </TouchableOpacity>
          {/* Description */}
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              About Community
            </Text>
            <Text
              style={[
                styles.communityDescription,
                { color: themeColors.textSecondary },
              ]}
            >
              {community.description}
            </Text>
          </View>
          {/* Rules */}
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Community Rules
            </Text>
            {(Array.isArray(community.rules) ? community.rules : []).map(
              (rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <Text
                    style={[styles.ruleNumber, { color: themeColors.accent }]}
                  >
                    {index + 1}.
                  </Text>
                  <Text
                    style={[
                      styles.ruleText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {rule}
                  </Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Community Item Component
const CommunityItem = ({ community, onPress, onJoinLeave, themeColors }) => {
  return (
    <TouchableOpacity
      style={[styles.communityItem, { backgroundColor: themeColors.card }]}
      onPress={() => onPress(community)}
    >
      <Image
        source={imageMap[community.avatar]}
        style={styles.communityAvatar}
      />
      <View style={styles.communityInfo}>
        <View style={styles.communityHeader}>
          <Text style={[styles.communityName, { color: themeColors.text }]}>
            n/{community.name}
          </Text>
          {community.isJoined && (
            <View
              style={[
                styles.joinedBadge,
                { backgroundColor: themeColors.accent },
              ]}
            >
              <Text
                style={[styles.joinedText, { color: themeColors.background }]}
              >
                Joined
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.communityMembers,
            { color: themeColors.textSecondary },
          ]}
        >
          {community.members} members • {community.category}
        </Text>
        <Text
          style={[
            styles.communityDescription,
            { color: themeColors.textSecondary },
          ]}
          numberOfLines={2}
        >
          {community.description}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.joinButtonSmall,
          {
            backgroundColor: community.isJoined
              ? themeColors.card
              : themeColors.accent,
          },
        ]}
        onPress={() => onJoinLeave(community.id)}
      >
        <Text
          style={[
            styles.joinButtonTextSmall,
            {
              color: community.isJoined
                ? themeColors.text
                : themeColors.background,
            },
          ]}
        >
          {community.isJoined ? "Joined" : "Join"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const Communities = ({ onJoinCommunity }) => {
  const router = useRouter();
  const [communities, setCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { themeColors } = useTheme();

  // Fetch communities from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCommunities();
        setCommunities(data);
      } catch (err) {
        Alert.alert("Error", "Could not fetch communities.");
      }
    };
    fetchData();
  }, []);

  // Filter communities by search text and category
  const getFilteredCommunities = () => {
    let filtered = communities;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (community) => community.category === selectedCategory
      );
    }

    // Filter by search
    if (searchText.trim() !== "") {
      const q = searchText.toLowerCase();
      filtered = filtered.filter(
        (community) =>
          (community.name && community.name.toLowerCase().includes(q)) ||
          (community.displayName &&
            community.displayName.toLowerCase().includes(q)) ||
          (community.description &&
            community.description.toLowerCase().includes(q))
      );
    }
    return filtered;
  };

  const filteredCommunitiesBySearch = getFilteredCommunities();

  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => {
    setSearchOpen(false);
    setSearchText("");
  };
  const handleSearch = (text) => {
    setSearchQuery(text);
    setSearchText(text);
  };
  const handleCommunityPress = (community) => {
    setSelectedCommunity(community);
    setShowDetailModal(true);
  };

  // Join/Leave Community
  const handleJoinLeave = async (communityId) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id === communityId) {
          const isJoining = !community.isJoined;
          return { ...community, isJoined: isJoining };
        }
        return community;
      })
    );
    try {
      const community = communities.find((c) => c.id === communityId);
      if (!community.isJoined) {
        await joinCommunity(communityId);
      } else {
        await leaveCommunity(communityId);
      }
    } catch (err) {
      // Optionally revert optimistic update or show error
    }
  };

  // Create Community
  const handleCreateCommunity = async (newCommunity) => {
    try {
      const created = await createCommunity(newCommunity);
      setCommunities((prev) => [created, ...prev]);
      Alert.alert(
        "Success!",
        `Community n/${created.name} has been created successfully!`,
        [
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "/(tabs)/create",
                params: { community: created.name },
              }),
          },
        ]
      );
    } catch (err) {
      Alert.alert("Error", "Could not create community.");
    }
  };

  const renderCommunityItem = ({ item }) => (
    <CommunityItem
      community={item}
      onPress={handleCommunityPress}
      onJoinLeave={handleJoinLeave}
      themeColors={themeColors}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Search Bar */}
      {searchOpen ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingTop: 40,
            backgroundColor: themeColors.background,
            borderBottomWidth: 1,
            borderColor: themeColors.border,
          }}
        >
          <Ionicons
            name="search"
            size={22}
            color={themeColors.icon}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 18,
              color: themeColors.text,
              paddingVertical: 8,
            }}
            placeholder="Search communities"
            placeholderTextColor={themeColors.textSecondary}
            value={searchText}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              style={{ marginHorizontal: 4 }}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={themeColors.icon}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleCancelSearch}
            style={{ marginLeft: 8 }}
          >
            <Text
              style={{ color: themeColors.accent || "#2E45A3", fontSize: 16 }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Header */}
      {!searchOpen && (
        <View
          style={[styles.header, { backgroundColor: themeColors.background }]}
        >
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            Communities
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchIcon}
            >
              <Ionicons name="search" size={24} color={themeColors.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: themeColors.accent },
              ]}
              onPress={() => setShowCreateModal(true)}
            >
              <Text
                style={[
                  styles.createButtonText,
                  { color: themeColors.background },
                ]}
              >
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Category Filter */}
      {!searchOpen && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryFilterContent}
        >
          {COMMUNITY_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                { backgroundColor: themeColors.card },
                selectedCategory === category && {
                  backgroundColor: themeColors.accent,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category
                        ? themeColors.background
                        : themeColors.text,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Communities List */}
      <FlatList
        data={filteredCommunitiesBySearch}
        renderItem={renderCommunityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="people-outline"
              size={64}
              color={themeColors.textSecondary}
            />
            <Text style={[styles.emptyStateTitle, { color: themeColors.text }]}>
              No communities found
            </Text>
            <Text
              style={[
                styles.emptyStateSubtitle,
                { color: themeColors.textSecondary },
              ]}
            >
              Try adjusting your search or create a new community
            </Text>
          </View>
        }
      />

      {/* Modals */}
      <CreateCommunityModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCommunityCreated={handleCreateCommunity}
        themeColors={themeColors}
      />

      <CommunityDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        community={selectedCommunity}
        onJoinLeave={handleJoinLeave}
        themeColors={themeColors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchButton: {
    marginRight: 12,
    padding: 8,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 80,
    minHeight: 36,
  },
  createButtonText: {
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
    textAlignVertical: "center",
  },
  categoryFilter: {
    maxHeight: 50,
    paddingHorizontal: 16,
  },
  categoryFilterContent: {
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  communityItem: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  communityAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  communityInfo: {
    flex: 1,
  },
  communityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  communityName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  joinedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  joinedText: {
    fontSize: 12,
    fontWeight: "600",
  },
  communityMembers: {
    fontSize: 14,
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  joinButtonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0079D3",
  },
  joinButtonTextSmall: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  nameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  namePrefix: {
    fontSize: 16,
    marginRight: 4,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
  },
  textInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputHint: {
    fontSize: 12,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: "row",
  },
  privacyContainer: {
    gap: 12,
  },
  privacyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
  },
  privacyTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  privacyDescription: {
    fontSize: 14,
  },
  // Community Detail Modal Styles
  communityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  communityDetailAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  communityHeaderInfo: {
    flex: 1,
  },
  communityDetailName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  communityDetailMembers: {
    fontSize: 16,
    marginBottom: 2,
  },
  communityDetailCategory: {
    fontSize: 14,
  },
  joinButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
});

export default Communities;
