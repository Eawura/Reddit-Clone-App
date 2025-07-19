import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { BookmarkProvider } from '../components/BookmarkContext';
import { NewsProvider } from '../components/NewsContext';
import { PostProvider } from '../components/PostContext';
import { AppProvider } from '../components/ThemeContext';

export default function RootLayout() {
  return (
    <NewsProvider>
      <AppProvider>
        <BookmarkProvider>
          <PostProvider>
            <Slot />
            <Toast />
          </PostProvider>
        </BookmarkProvider>
      </AppProvider>
    </NewsProvider>
  );
} 