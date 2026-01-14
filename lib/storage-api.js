export async function getFromStorage(key) {
  const result = await browser.storage.local.get(key);
  return result[key];
}

export async function setInStorage(key, value) {
  await browser.storage.local.set({ [key]: value });
}

export async function removeFromStorage(key) {
  await browser.storage.local.remove(key);
}

export async function clearStorage() {
  await browser.storage.local.clear();
}
