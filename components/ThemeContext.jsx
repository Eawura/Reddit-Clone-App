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