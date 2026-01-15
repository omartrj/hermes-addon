// Wrapper for browser.storage.local API
// Provides simplified interface for storage operations

/**
 * Get value from storage
 */
export async function getFromStorage(key) {
  const result = await browser.storage.local.get(key);
  return result[key];
}

/**
 * Save value to storage
 */
export async function setInStorage(key, value) {
  await browser.storage.local.set({ [key]: value });
}

/**
 * Remove value from storage
 */
export async function removeFromStorage(key) {
  await browser.storage.local.remove(key);
}

/**
 * Clear storage completely
 */
export async function clearStorage() {
  await browser.storage.local.clear();
}

/**
 * Get multiple values simultaneously
 */
export async function getMultipleFromStorage(keys) {
  return await browser.storage.local.get(keys);
}

/**
 * Save multiple values simultaneously
 */
export async function setMultipleInStorage(items) {
  await browser.storage.local.set(items);
}

/**
 * Check if key exists in storage
 */
export async function existsInStorage(key) {
  const result = await browser.storage.local.get(key);
  return result[key] !== undefined;
}
