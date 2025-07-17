// components/HomeAppBar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';

export default function HomeAppBar({title}) {
  return (
    <View style={styles.container}>
      {/* Left – Menu + App name */}
      <View style={styles.left}>
        <Ionicons name="menu" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.logo}>{title}</Text>
      </View>

      {/* Right – Search + Profile */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="search" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'left',
    
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginHorizontal: 100
  },
  right: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
});
