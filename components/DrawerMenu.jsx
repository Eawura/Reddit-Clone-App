import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDrawerContext, useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;

export default function DrawerMenu({ profile }) {
  const { themeColors, toggleTheme, theme } = useTheme();
  const { drawerOpen, closeDrawer } = useDrawerContext();
  const router = useRouter();

  // Animate drawer
  const translateX = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: drawerOpen ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [drawerOpen]);

  // Navigation handler
  const handleNav = (path) => {
    closeDrawer();
    setTimeout(() => router.replace(path), 200);
  };

  // Menu items
  const menu = [
    { icon: <Ionicons name="home-outline" size={24} color={themeColors.icon} />, label: 'Home', path: '/(tabs)/index' },
    { icon: <Ionicons name="flame-outline" size={24} color={themeColors.icon} />, label: 'Popular', path: '/(tabs)/popular' },
    { icon: <Ionicons name="people-circle-outline" size={24} color={themeColors.icon} />, label: 'Communities', path: '/(tabs)/communities' },
    { icon: <Feather name="plus" size={24} color={themeColors.icon} />, label: 'Create Post', path: '/(tabs)/create' },
    { icon: <Ionicons name="chatbubble-ellipses-outline" size={24} color={themeColors.icon} />, label: 'Chat', path: '/(tabs)/chat' },
    { icon: <MaterialCommunityIcons name="bell-outline" size={24} color={themeColors.icon} />, label: 'Inbox', path: '/(tabs)/inbox' },
    { icon: <Ionicons name="settings-outline" size={24} color={themeColors.icon} />, label: 'Settings', path: '/settings' },
  ];

  if (!drawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDrawer} />
      {/* Drawer */}
      <Animated.View style={[styles.drawer, { backgroundColor: themeColors.background, transform: [{ translateX }] }] }>
        {/* Profile */}
        <View style={styles.profileSection}>
          <Image source={profile?.avatar || require('../assets/images/Random.jpg')} style={styles.avatar} />
          <Text style={[styles.username, { color: themeColors.text }]}>{profile?.name || 'User'}</Text>
          <Text style={[styles.karma, { color: themeColors.textSecondary }]}>Karma: {profile?.karma || 1234}</Text>
        </View>
        {/* Menu */}
        <View style={styles.menuSection}>
          {menu.map(item => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => handleNav(item.path)}>
              {item.icon}
              <Text style={[styles.menuLabel, { color: themeColors.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Theme toggle & logout */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
            <Ionicons name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'} size={22} color={themeColors.icon} />
            <Text style={[styles.menuLabel, { color: themeColors.text }]}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { closeDrawer(); setTimeout(() => router.replace('/'), 200); }}>
            <MaterialCommunityIcons name="logout" size={22} color={themeColors.icon} />
            <Text style={[styles.menuLabel, { color: themeColors.text }]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 20,
    elevation: 20,
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 18,
    justifyContent: 'space-between',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  karma: {
    fontSize: 14,
    color: '#888',
  },
  menuSection: {
    flex: 1,
    marginTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 16,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 12,
  },
}); 