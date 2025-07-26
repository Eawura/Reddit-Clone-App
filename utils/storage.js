import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import webStorage from './webStorage';

const isWeb = Platform.OS === 'web';
const DEBUG = true; // Enable debug logging

// Use webStorage for web, SecureStore for native
const storage = isWeb ? webStorage : {
  async getItem(key) {
    try {
      if (DEBUG) console.log(`[Storage] Getting item from SecureStore: ${key}`);
      const value = await SecureStore.getItemAsync(key);
      if (DEBUG) console.log(`[Storage] Retrieved ${key}:`, value ? 'Value exists' : 'No value found');
      return value;
    } catch (error) {
      console.error(`[Storage] Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      if (DEBUG) console.log(`[Storage] Setting item ${key}`);
      if (value === null || value === undefined) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`[Storage] Error setting item ${key}:`, error);
      throw error;
    }
  },

  async deleteItem(key) {
    try {
      if (DEBUG) console.log(`[Storage] Deleting item: ${key}`);
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[Storage] Error deleting item ${key}:`, error);
      throw error;
    }
  },
  
  // For native, we can't list all keys
  async listKeys() {
    if (DEBUG) console.log('[Storage] listKeys() is not supported on native platforms');
    return [];
  },
  
  // Clear all auth tokens (for compatibility with webStorage)
  async clearAuthTokens() {
    await this.deleteItem('auth_token');
    await this.deleteItem('refresh_token');
    if (DEBUG) console.log('[Storage] Cleared all auth tokens');
  },
  
  // Check if we have a valid token (for compatibility with webStorage)
  async hasValidToken() {
    const token = await this.getItem('auth_token');
    return !!token;
  }
};

export default storage;
