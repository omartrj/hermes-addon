// Simple wrapper for browser.storage API
// No business logic - just read/write operations

/**
 * Local storage operations (persistent)
 */
export const local = {
  async get(key) {
    const result = await browser.storage.local.get(key);
    return result[key];
  },

  async set(key, value) {
    await browser.storage.local.set({ [key]: value });
  },

  async remove(key) {
    await browser.storage.local.remove(key);
  },

  async clear() {
    await browser.storage.local.clear();
  }
};

/**
 * Session storage operations (cleared on browser close)
 */
export const session = {
  async get(key) {
    try {
      const result = await browser.storage.session.get(key);
      return result[key];
    } catch (error) {
      // Fallback for Firefox < 115
      return null;
    }
  },

  async set(key, value) {
    try {
      await browser.storage.session.set({ [key]: value });
    } catch (error) {
      // Fallback for Firefox < 115 - do nothing
      console.warn('Session storage not available');
    }
  },

  async remove(key) {
    try {
      await browser.storage.session.remove(key);
    } catch (error) {
      // Ignore errors
    }
  },

  async clear() {
    try {
      await browser.storage.session.clear();
    } catch (error) {
      // Ignore errors
    }
  }
};
