import { Slot } from 'expo-router';
import { ThemeProvider } from '../components/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
} 