import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Communities = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button - Allows users to return to the previous screen */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons
          name="log-out-outline"
          size={36}
          color="#444"
          style={{ transform: [{ scaleX: -1 }] }}
        />
      </TouchableOpacity>

      {/* Search Bar - Enables users to search for specific communities */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={24}
          color="#444"
          style={{ marginLeft: 10, marginRight: 6 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a community"
          placeholderTextColor="#444"
        />
      </View>

      {/* Help Section - Provides guidance for users who are unsure where to post */}
      <Text style={styles.notSure}>Not sure what to search for?</Text>
      <Text style={styles.infoText}>
        There is a community for just about everything on{"\n"}Neoping but if
        you're not sure where you should post, try browsing communities by topic
        first.
      </Text>

      {/* Browse Communities Link - Alternative way to discover communities */}
      <TouchableOpacity>
        <Text style={styles.browseLink}>Browse communities</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 8,
    left: 20,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 18,
    width: "90%",
    height: 54,
    marginTop: 40,
    marginBottom: 40,
    paddingHorizontal: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "#222",
    backgroundColor: "transparent",
    marginLeft: 4,
  },
  notSure: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 16,
    alignSelf: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#222",
    textAlign: "center",
    marginHorizontal: 18,
    marginBottom: 18,
  },
  browseLink: {
    color: "#3a4bb7",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginTop: 4,
  },
});

export default Communities;
