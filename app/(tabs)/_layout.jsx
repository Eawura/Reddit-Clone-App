import { AntDesign } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../components/ThemeContext';

export default function TabsLayout() {
  const { themeColors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.accent || '#2E45A3',
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderColor: themeColors.border,
        },
        headerStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Fontisto name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Communities',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watch"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="popular"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="latest"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  asareStyle: {
    color: '#000',
    marginTop: 400,
    marginLeft: 150,
  },
});
