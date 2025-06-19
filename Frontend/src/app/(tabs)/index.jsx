/*import { Stack } from 'expo-router';
import { View } from 'react-native';
const index = () => {
  return (
    <View>
      <Stack.Screen
          options={{
            headerTitle: '',     
            headerShadowVisible: false,
          }}
        />
    </View>
  )
}

export default index*/

import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import data from "./data.json";

const imageMap = {
  "harry logo.webp.jpg": require("../../assets/images/harry logo.webp.jpg"),
  "daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp": require("../../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp"),
  "Logo-NBA.png.jpg": require("../../assets/images/Logo-NBA.png.jpg"),
  "curry.jpg": require("../../assets/images/curry.jpg"),
  "fifa logo.jpg": require("../../assets/images/fifa logo.jpg"),
  "Messi.jpg": require("../../assets/images/Messi.jpg"),
  "Grand.jpg": require("../../assets/images/Grand.jpg"),
  "Ramen.jpg": require("../../assets/images/Ramen.jpg"),
  // Add more mappings as needed
};

const Post = ({ post, onLike, onDislike, onComment, onShare }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Image
        source={
          imageMap[post.avatar] ? imageMap[post.avatar] : { uri: post.avatar }
        }
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.postUser}>
          {post.user} <Text style={styles.postTime}>• {post.time}</Text>
        </Text>
        <Text style={styles.postTitle}>{post.title}</Text>
      </View>
      <TouchableOpacity>
        <Feather name="more-horizontal" size={20} color="#000" />
      </TouchableOpacity>
    </View>
    <Image
      source={imageMap[post.image] ? imageMap[post.image] : { uri: post.image }}
      style={styles.postImage}
    />
    <View style={styles.postActions}>
      <View style={styles.actionGroup}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onLike(post.id)}
        >
          <AntDesign
            name={post.liked ? "heart" : "hearto"}
            size={20}
            color={post.liked ? "#e74c3c" : "#ccc"}
          />
          <Text
            style={[
              styles.actionText,
              post.liked && { color: "#e74c3c", fontWeight: "bold" },
            ]}
          >
            {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDislike(post.id)}
        >
          <MaterialIcons
            name={post.disliked ? "heart-broken" : "heart-broken"}
            size={24}
            color={post.disliked ? "#e74c3c" : "#ccc"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onComment(post.id)}
        >
          <Feather name="message-circle" size={20} color="#ccc" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => onShare(post.id)}>
        <Feather name="share-2" size={20} color="#ccc" />
        <Text style={styles.actionText}>{post.shares}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const PopupMenu = ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.menuContainer}>
      {/* Home (active) */}
      <View style={styles.menuItem}>
        <AntDesign name="home" size={24} color="#3a4bb7" />
        <Text style={[styles.menuText, styles.activeText]}>Home</Text>
      </View>
      {/* Popular */}
      <View style={styles.menuItem}>
        <Feather name="arrow-up-right" size={24} color="#222" />
        <Text style={styles.menuText}>Popular</Text>
      </View>
      {/* Watch */}
      <View style={styles.menuItem}>
        <Feather name="play-circle" size={24} color="#222" />
        <Text style={styles.menuText}>Watch</Text>
      </View>
      {/* News */}
      <View style={styles.menuItem}>
        <FontAwesome5 name="newspaper" size={22} color="#222" />
        <Text style={styles.menuText}>News</Text>
      </View>
      {/* Latest */}
      <View style={styles.menuItem}>
        <Entypo name="back-in-time" size={24} color="#222" />
        <Text style={styles.menuText}>Latest</Text>
      </View>
       
    </View>
  );
};

const Header = ({ menuOpen, setMenuOpen }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <TouchableOpacity>
        <Feather name="menu" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => setMenuOpen((open) => !open)}
      >
        <Text style={styles.logoText}>Neoping </Text>
        <Ionicons
          name={menuOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
    <View style={styles.headerIcons}>
      <TouchableOpacity style={{ marginRight: 16 }}>
        <Ionicons name="search" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const index = () => {
  const [posts, setPosts] = useState(
    data.posts.map((p) => ({ ...p, liked: false, disliked: false }))
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLike = (id) => {
    setPosts((posts) =>
      posts.map((post) => {
        if (post.id === id) {
          if (post.liked) {
            return { ...post, liked: false, likes: post.likes - 1 };
          } else {
            return {
              ...post,
              liked: true,
              disliked: false,
              likes: post.likes + 1,
            };
          }
        }
        return post;
      })
    );
  };

  const handleDislike = (id) => {
    setPosts((posts) =>
      posts.map((post) => {
        if (post.id === id) {
          if (post.disliked) {
            return { ...post, disliked: false };
          } else {
            return {
              ...post,
              disliked: true,
              liked: false,
              likes: post.liked ? post.likes - 1 : post.likes,
            };
          }
        }
        return post;
      })
    );
  };

  const handleComment = (id) => {
    // Placeholder: In a real app, open comment modal or navigate
    alert("Open comments for post " + id);
  };

  const handleShare = (id) => {
    // Placeholder: In a real app, open share dialog
    alert("Share post " + id);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(
        data.posts.map((p) => ({ ...p, liked: false, disliked: false }))
      );
      setRefreshing(false);
    }, 1200);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2E45A3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <PopupMenu visible={menuOpen} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            post={item}
            onLike={handleLike}
            onDislike={handleDislike}
            onComment={handleComment}
            onShare={handleShare}
          />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#888", fontSize: 16 }}>
              No posts to show. Pull to refresh!
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: 0,
    borderRadius: 12,
    marginHorizontal: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  postUser: {
    fontWeight: "bold",
    color: "#222",
    fontSize: 14,
  },
  postTime: {
    color: "#888",
    fontWeight: "normal",
    fontSize: 12,
  },
  postTitle: {
    color: "#111",
    fontSize: 15,
    marginTop: 2,
    marginBottom: 4,
  },
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    color: "#bbb",
    fontSize: 14,
  },
  separator: {
    height: 10,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    color: "#2E45A3",
    fontWeight: "bold",
    fontSize: 22,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  popupMenu: {
    position: "absolute",
    top: 70,
    left: 16,
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 0,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  popupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  popupItemActive: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(46,69,163,0.07)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  popupText: {
    color: "#222",
    fontSize: 16,
  },
  popupActiveText: {
    color: "#2E45A3",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default index;
