import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeAppBar from '../Components/HomeAppBar';

export default function InboxScreen() {
  return (
    <View style={styles.container}>
      <HomeAppBar 
        title="Inbox"/>
      <Text>🏠 Inbox Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, }
});
