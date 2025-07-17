// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import CommunityScreen from './screens/CommunityScreen';
import CreateScreen from './screens/CreateScreen';
import ChatScreen from './screens/ChatScreen';
import InboxScreen from './screens/InboxScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Ionicons name="home" size={size} color={color} />;
          if (route.name === 'Community') return <MaterialCommunityIcons name="account-group" size={size} color={color} />;
          if (route.name === 'Create') return <Feather name="plus-circle" size={size} color={color} />;
          if (route.name === 'Chat') return <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />;
          if (route.name === 'Inbox') return <Ionicons name="mail-outline" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#000', 
          height: 150, // increase tab height here
          paddingBottom: 20, // optional: centers icons/labels
          paddingTop: 20,   
      },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
    </Tab.Navigator>
  );
}
