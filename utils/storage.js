import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import webStorage from "./webStorage";

const ONBOARDING_COMPLETE = "@onboarding_complete";
const AUTHENTICATED = "@authenticated";

const isWeb = Platform.OS === "web";
const DEBUG = true;

const nativeStorage = {
  async getItem(key) {
    try {
      if (DEBUG) console.log(`[Storage] Getting item: ${key}`);
      const value = await SecureStore.getItemAsync(key);
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
    }
  },

  async deleteItem(key) {
    try {
      if (DEBUG) console.log(`[Storage] Deleting item: ${key}`);
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[Storage] Error deleting item ${key}:`, error);
    }
  },

  async clearAuthTokens() {
    await this.deleteItem("auth_token");
    await this.deleteItem("refresh_token");
  },

  async hasValidToken() {
    const token = await this.getItem("auth_token");
    return !!token;
  },

  async setOnboardingComplete(value = true) {
    await this.setItem(ONBOARDING_COMPLETE, JSON.stringify(value));
  },

  async getOnboardingStatus() {
    const value = await this.getItem(ONBOARDING_COMPLETE);
    return value === "true" || value === true;
  },

  async setAuthenticated(value = true) {
    await this.setItem(AUTHENTICATED, JSON.stringify(value));
  },

  async getAuthStatus() {
    const value = await this.getItem(AUTHENTICATED);
    return value === "true" || value === true;
  },
};

const storage = isWeb ? webStorage : nativeStorage;

export default storage;
