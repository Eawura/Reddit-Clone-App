import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export const options = { headerShown: false };
const Create = () => {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="log-out-outline"
            size={28}
            color="#444"
            style={{ transform: [{ scaleX: -1 }] }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} disabled>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Select Community */}
      <TouchableOpacity style={styles.selectCommunity}>
        <View style={styles.communityIcon}>
          <Text style={styles.communityIconText}>n/</Text>
        </View>
        <Text style={styles.selectCommunityText}>Select a community</Text>
      </TouchableOpacity>

      {/* Title Input */}
      <Text style={styles.titleLabel}>Title</Text>
      <TextInput
        style={styles.titleInput}
        placeholder=""
        placeholderTextColor="#888"
      />

      {/* Body Input */}
      <TextInput
        style={styles.bodyInput}
        placeholder="body text (optional)"
        placeholderTextColor="#222"
        multiline
      />

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Entypo name="attachment" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="add-photo-alternate" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-circle-outline" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="list-ol" size={24} color="#222" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  postButton: {
    backgroundColor: "#ccd0d2",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  postButtonText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 18,
  },
  selectCommunity: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
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
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  communityIconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  selectCommunityText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#222",
  },
  titleLabel: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#666",
    marginLeft: 16,
    marginBottom: 6,
  },
  titleInput: {
    fontSize: 16,
    color: "#222",
    marginHorizontal: 16,
    marginBottom: 18,
    borderBottomWidth: 0,
    fontWeight: "500",
  },
  bodyInput: {
    fontSize: 15,
    color: "#111",
    marginHorizontal: 16,
    marginBottom: 18,
    borderBottomWidth: 0,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 32,
  },
});

export default Create;
