import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { BookmarkProvider } from "../components/BookmarkContext";
import { NewsProvider } from "../components/NewsContext";
import { PostProvider } from "../components/PostContext";
import { AppProvider } from "../components/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { authAPI } from "../utils/api";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  return (
    <NewsProvider>
      <AppProvider>
        <BookmarkProvider>
          <PostProvider>
            <AuthProvider>
              {" "}
              {/* ✅ Add this wrapper */}
              <Slot />
            </AuthProvider>
          </PostProvider>
        </BookmarkProvider>
      </AppProvider>
    </NewsProvider>
  );
}
