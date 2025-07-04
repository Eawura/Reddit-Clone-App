import { Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from './ThemeContext';

const PopupMenu = ({ visible, router }) => {
  const pathname = usePathname();
  const { themeColors } = useTheme();

  const menuItems = [
    { name: 'Home', href: '/', icon: <FontAwesome5 name="home" size={24} />, active: pathname === '/' },
    { name: 'Popular', href: '/popular', icon: <Feather name="arrow-up-right" size={24} />, active: pathname === '/popular' },
    { name: 'Watch', href: '/watch', icon: <Feather name="play-circle" size={24} />, active: pathname === '/watch' },
    { name: 'News', href: '/news', icon: <FontAwesome5 name="newspaper" size={22} />, active: pathname === '/news' },
    { name: 'Latest', href: '/latest', icon: <Entypo name="back-in-time" size={24} />, active: pathname === '/latest' }
  ];

  if (!visible) return null;

  return (
    <View style={[styles.menuContainer, { backgroundColor: themeColors.card }] }>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[styles.menuItem, item.active && { backgroundColor: themeColors.accent + '22' }]}
          onPress={() => item.href !== '#' && router.push(item.href)}
        >
          {React.cloneElement(item.icon, { color: item.active ? themeColors.accent : themeColors.icon })}
          <Text style={[styles.menuText, { color: item.active ? themeColors.accent : themeColors.text }, item.active && styles.activeText]}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 90,
    left: 50,
    width: 180,
    borderRadius: 10,
    padding: 4,
    zIndex: 1,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  menuText: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '500',
  },
  activeText: {
    fontWeight: 'bold',
  },
});

export default PopupMenu; 