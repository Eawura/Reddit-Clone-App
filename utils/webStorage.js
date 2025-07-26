/**
 * Web-specific storage implementation that ensures tokens are properly persisted
 * and available across page reloads and navigation.
 */

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// In-memory cache for tokens
let tokenCache = {
  [TOKEN_KEY]: null,
  [REFRESH_TOKEN_KEY]: null,
  _initialized: false,
};

// Initialize the token cache from localStorage
function initializeCache() {
  if (tokenCache._initialized) return;

  try {
    // Load tokens from localStorage if available
    if (typeof window !== "undefined" && window.localStorage) {
      tokenCache[TOKEN_KEY] = localStorage.getItem(TOKEN_KEY);
      tokenCache[REFRESH_TOKEN_KEY] = localStorage.getItem(REFRESH_TOKEN_KEY);
      console.log("[WebStorage] Initialized token cache from localStorage:", {
        hasToken: !!tokenCache[TOKEN_KEY],
        hasRefreshToken: !!tokenCache[REFRESH_TOKEN_KEY],
      });
    }
  } catch (error) {
    console.error("[WebStorage] Error initializing token cache:", error);
  } finally {
    tokenCache._initialized = true;
  }
}

// Initialize immediately when this module loads
if (typeof window !== "undefined") {
  initializeCache();
}

const webStorage = {
  async getItem(key) {
    if (!tokenCache._initialized) {
      initializeCache();
    }

    // Check in-memory cache first
    if (key in tokenCache && tokenCache[key] !== null) {
      return tokenCache[key];
    }

    // Fall back to localStorage
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          // Update cache
          tokenCache[key] = value;
          return value;
        }
      }
    } catch (error) {
      console.error(`[WebStorage] Error getting ${key}:`, error);
    }

    return null;
  },

  async setItem(key, value) {
    // Update in-memory cache
    tokenCache[key] = value;

    // Persist to localStorage
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        if (value === null || value === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }
        console.log(
          `[WebStorage] ${key} ${
            value === null ? "removed from" : "saved to"
          } localStorage`
        );
      }
    } catch (error) {
      console.error(`[WebStorage] Error setting ${key}:`, error);
      throw error;
    }
  },

  async deleteItem(key) {
    return this.setItem(key, null);
  },

  async listKeys() {
    if (typeof window !== "undefined" && window.localStorage) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      console.log("[WebStorage] All localStorage keys:", keys);
      return keys;
    }
    console.log("[WebStorage] localStorage not available");
    return [];
  },

  // Clear all stored tokens (for logout)
  async clearAuthTokens() {
    await this.deleteItem(TOKEN_KEY);
    await this.deleteItem(REFRESH_TOKEN_KEY);
    console.log("[WebStorage] Cleared all auth tokens");
  },

  // Check if we have a valid token
  async hasValidToken() {
    const token = await this.getItem(TOKEN_KEY);
    return !!token;
  },
};

export default webStorage;
