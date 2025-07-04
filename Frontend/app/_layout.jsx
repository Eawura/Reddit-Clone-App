import { Slot } from 'expo-router';
import { BookmarkProvider } from '../components/BookmarkContext';
import { PostProvider } from '../components/PostContext';
import { AppProvider } from '../components/ThemeContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <BookmarkProvider>
        <PostProvider>
          <Slot />
        </PostProvider>
      </BookmarkProvider>
    </AppProvider>
  );
} 