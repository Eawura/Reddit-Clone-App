import { AntDesign, Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PopupMenu = ({ visible, router }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', href: '/', icon: <AntDesign name="home" size={24} />, active: pathname === '/' },
    { name: 'Popular', href: '/popular', icon: <Feather name="arrow-up-right" size={24} />, active: pathname === '/popular' },
    { name: 'Watch', href: '/watch', icon: <Feather name="play-circle" size={24} />, active: pathname === '/watch' },
    { name: 'News', href: '/news', icon: <FontAwesome5 name="newspaper" size={22} />, active: pathname === '/news' },
    { name: 'Latest', href: '/latest', icon: <Entypo name="back-in-time" size={24} />, active: pathname === '/latest' }
  ];

  if (!visible) return null;

  return (
    <View style={styles.menuContainer}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[styles.menuItem, item.active && styles.activeMenuItem]}
          onPress={() => item.href !== '#' && router.push(item.href)}
        >
          {React.cloneElement(item.icon, { color: item.active ? '#2E45A3' : '#222' })}
          <Text style={[styles.menuText, item.active && styles.activeText]}>{item.name}</Text>
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
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: '#B9C1F7',
  },
  menuText: {
    marginLeft: 20,
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
  },
  activeText: {
    color: '#2E45A3',
    fontWeight: 'bold',
  },
});

export default PopupMenu; 