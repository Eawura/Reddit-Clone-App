import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import HomeAppBar from '../Components/HomeAppBar'
import { Feather, Ionicons } from '@expo/vector-icons';

const posts = [
  {
    id: '1',
    user: 'harryPotter',
    time: '4 mins ago',
    title: "Daniel Radcliffe’s acting",
    image: require('../assets/harry.png'), // replace with your image
    avatar: require('../assets/avatar.png'),
  },
  {
    id: '2',
    user: 'NBA',
    time: '3 months ago',
    title: "Lebron James x Stephen Curry",
    image: require('../assets/harry.png'),
    avatar: require('../assets/avatar.png'),
  },
];

export default function HomeScreen() {
  const renderPost = ({ item }) => (
    <View style={styles.post}>
      {/* Header */}
      <View style={styles.postHeader}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>r/{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Feather name="more-horizontal" size={20} color="#666" />
      </View>

      {/* Post title */}
      <Text style={styles.postTitle}>{item.title}</Text>

      {/* Post image */}
      <Image source={item.image} style={styles.postImage} />

      {/* Actions */}
      <View style={styles.actions}>
        <Ionicons name="heart-outline" size={20} color="#666" style={styles.icon} />
        <Ionicons name="chatbubble-outline" size={20} color="#666" style={styles.icon} />
        <Ionicons name="arrow-redo-outline" size={20} color="#666" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HomeAppBar 
        title="Neoping"
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  post: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  username: { fontWeight: '600', color: '#222' },
  time: { fontSize: 12, color: '#888' },
  postTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 20,
  },
});
