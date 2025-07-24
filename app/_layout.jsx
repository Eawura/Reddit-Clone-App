import { Slot } from 'expo-router';
import { Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { BookmarkProvider } from '../components/BookmarkContext';
import { NewsProvider } from '../components/NewsContext';
import { PostProvider } from '../components/PostContext';
import { ProfileProvider } from '../components/ProfileContext';
import { ChatProvider, DrawerProvider, ThemeProvider } from '../components/ThemeContext';

// Disable system font scaling globally
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <NewsProvider>
          <BookmarkProvider>
            <PostProvider>
              <ChatProvider>
                <DrawerProvider>
                  <Slot />
                  <Toast />
                </DrawerProvider>
              </ChatProvider>
            </PostProvider>
          </BookmarkProvider>
        </NewsProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
} 