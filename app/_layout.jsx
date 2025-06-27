import { Slot } from 'expo-router';
import { BookmarkProvider } from '../components/BookmarkContext';
import { AppProvider } from '../components/ThemeContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <BookmarkProvider>
        <Slot />
      </BookmarkProvider>
    </AppProvider>
  );
} 