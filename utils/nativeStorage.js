import AsyncStorage from "@react-native-async-storage/async-storage";

const nativeStorage = {
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error(`[NativeStorage] Error getting ${key}:`, error);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      if (value === null || value === undefined) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`[NativeStorage] Error setting ${key}:`, error);
    }
  },

  async deleteItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[NativeStorage] Error deleting ${key}:`, error);
    }
  },

  async listKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log("[NativeStorage] Keys:", keys);
      return keys;
    } catch (error) {
      console.error("[NativeStorage] Error listing keys:", error);
      return [];
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
};

export default nativeStorage;
