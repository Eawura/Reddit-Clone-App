import React, { createContext, useContext, useState } from 'react';
import { ProfileProvider } from './ProfileContext';

const ThemeContext = createContext();

const lightColors = {
  background: '#fff',
  card: '#fafafa',
  text: '#111',
  textSecondary: '#333',
  border: '#e0e0e0',
  icon: '#222',
  accent: '#2E45A3',
};

const darkColors = {
  background: '#181818',
  card: '#232323',
  text: '#fff',
  textSecondary: '#ccc',
  border: 'rgba(255,255,255,0.07)',
  icon: '#fff',
  accent: '#4A90E2',
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const themeColors = theme === 'light' ? lightColors : darkColors;
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// --- Chat Context ---
const initialChats = [
  {
    id: '1',
    name: 'Tommie Francis',
    avatar: 'Random.jpg',
    lastMessage: 'Are you free tonight?',
    time: '19:22',
    unread: 1,
    messageStatus: 'received',
  },
  {
    id: '2',
    name: 'Recky',
    avatar: 'danny-1.webp',
    lastMessage: 'Can we meet tomorrow?',
    time: '19:15',
    unread: 2,
    messageStatus: 'received',
  },
];

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(initialChats);
  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}

// --- Drawer Context ---
const DrawerContext = createContext();

export function DrawerProvider({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const toggleDrawer = () => setDrawerOpen(open => !open);
  return (
    <DrawerContext.Provider value={{ drawerOpen, openDrawer, closeDrawer, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawerContext() {
  return useContext(DrawerContext);
}

// Update AppProvider to include DrawerProvider
export function AppProvider({ children }) {
  return (
    <ProfileProvider>
      <ThemeProvider>
        <ChatProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </ChatProvider>
      </ThemeProvider>
    </ProfileProvider>
  );
} 