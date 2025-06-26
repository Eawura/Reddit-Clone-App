import { Feather, Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';

const notifications = [
  {
    id: '1',
    name: 'Jane Gray',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    message: 'Commented on your post: Exciting...'
  },
  {
    id: '2',
    name: 'Jasper',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    message: 'Replied to your Comment : What are the...'
  },
  {
    id: '3',
    name: 'Kelvin',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    message: 'Mentioned you in a discussion about Solar...'
  },
  {
    id: '4',
    name: 'Michael Brown',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
    message: 'Upvoted your comment on Healthy Living...'
  },
];

const InboxHeader = ({ menuOpen, setMenuOpen, onProfilePress }) => {
  const router = useRouter();
  const { themeColors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: themeColors.background }] }>
      <TouchableOpacity onPress={() => setMenuOpen(open => !open)}>
        <Feather name="menu" size={28} color={themeColors.icon} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: '#2E45A3' }]}>Inbox</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <Ionicons name="search" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress}>
          <Ionicons name="person-circle-outline" size={28} color={themeColors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Inbox = () => {
  const [tab, setTab] = useState('Notifications');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [lastTabPath, setLastTabPath] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const { themeColors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <InboxHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => { setLastTabPath(pathname); setProfileModalVisible(true); }} />
      <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onLogout={() => { setProfileModalVisible(false); if (lastTabPath) router.replace(lastTabPath); }} lastTabPath={lastTabPath} />
      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: themeColors.border, backgroundColor: themeColors.background }}>
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }} onPress={() => setTab('Notifications')}>
          <Text style={{ color: tab === 'Notifications' ? themeColors.text : themeColors.textSecondary, fontWeight: 'bold', fontSize: 16 }}>Notifications</Text>
          {tab === 'Notifications' && <View style={{ height: 2, backgroundColor: '#3a4bb7', width: '60%', marginTop: 4 }} />}
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }} onPress={() => setTab('Messages')}>
          <Text style={{ color: tab === 'Messages' ? themeColors.text : themeColors.textSecondary, fontWeight: 'bold', fontSize: 16 }}>Messages</Text>
          {tab === 'Messages' && <View style={{ height: 2, backgroundColor: '#3a4bb7', width: '60%', marginTop: 4 }} />}
        </TouchableOpacity>
      </View>
      {/* Content */}
      {tab === 'Notifications' ? (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={{ textAlign: 'center', marginVertical: 18, fontSize: 18, color: '#222', fontWeight: '500' }}>
            Stay updated with your notifications
          </Text>
          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginHorizontal: 18 }}>
                <Image source={{ uri: item.avatar }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 14 }} />
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>{item.name}</Text>
                  <Text style={{ color: '#444', fontSize: 14, marginTop: 2 }}>{item.message}</Text>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#888', fontSize: 18 }}>No messages yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: '#2946d7',
    fontWeight: 'bold',
    fontSize: 22,
    flex: 1,
    textAlign: 'center',
    marginLeft: -28,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Inbox;
