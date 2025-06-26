import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const lightColors = {
  background: '#fff',
  card: '#fafafa',
  text: '#111',
  textSecondary: '#333',
  border: '#e0e0e0',
  icon: '#222',
};

const darkColors = {
  background: '#181818',
  card: '#232323',
  text: '#fff',
  textSecondary: '#ccc',
  border: '#333',
  icon: '#fff',
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
    lastMessage: 'Heyyy',
    time: '19:22',
    unread: 1,
  },
  {
    id: '2',
    name: 'Recky',
    avatar: 'danny-1.webp',
    lastMessage: 'Good evening. Where are you ...',
    time: '19:15',
    unread: 1,
  },
  {
    id: '3',
    name: 'Dad❤️❤️',
    avatar: 'D.jpg',
    lastMessage: "What's up?",
    time: '18:52',
    unread: 1,
  },
  {
    id: '4',
    name: 'Michael Brown',
    avatar: 'MB.jpg',
    lastMessage: 'Try exercising a lot.',
    time: '18:00',
    unread: 1,
  },
  {
    id: '5',
    name: 'Suzette Brewer',
    avatar: 'w1.jpg',
    lastMessage: '📷 Photo',
    time: '12:01',
    unread: 1,
  },
  {
    id: '6',
    name: 'Kelly Fletcher',
    avatar: 'K.jpg',
    lastMessage: '😂😂😂',
    time: '10:33',
    unread: 1,
  },
  {
    id: '7',
    name: 'Neal Mcintosh',
    avatar: 'N.webp',
    lastMessage: 'lol',
    time: '7:59',
    unread: 1,
  },
  {
    id: '8',
    name: 'Darius Yu',
    avatar: 'yu.jpg',
    lastMessage: 'Thank you 😊',
    time: '6:06',
    unread: 1,
  },
  {
    id: '9',
    name: 'Mary',
    avatar: 'w1.jpg',
    lastMessage: 'Photo',
    time: 'Yesterday',
    unread: 1,
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
    <ThemeProvider>
      <ChatProvider>
        <DrawerProvider>{children}</DrawerProvider>
      </ChatProvider>
    </ThemeProvider>
  );
} 