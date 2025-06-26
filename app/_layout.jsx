import { Slot } from 'expo-router';
import { AppProvider } from '../components/ThemeContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
} 