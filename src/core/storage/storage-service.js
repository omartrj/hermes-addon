// Wrapper per browser.storage.local API
// Fornisce un'interfaccia semplificata per storage operations

/**
 * Ottiene un valore dallo storage
 */
export async function getFromStorage(key) {
  const result = await browser.storage.local.get(key);
  return result[key];
}

/**
 * Salva un valore nello storage
 */
export async function setInStorage(key, value) {
  await browser.storage.local.set({ [key]: value });
}

/**
 * Rimuove un valore dallo storage
 */
export async function removeFromStorage(key) {
  await browser.storage.local.remove(key);
}

/**
 * Svuota completamente lo storage
 */
export async function clearStorage() {
  await browser.storage.local.clear();
}

/**
 * Ottiene più valori contemporaneamente
 */
export async function getMultipleFromStorage(keys) {
  return await browser.storage.local.get(keys);
}

/**
 * Salva più valori contemporaneamente
 */
export async function setMultipleInStorage(items) {
  await browser.storage.local.set(items);
}

/**
 * Verifica se una chiave esiste nello storage
 */
export async function existsInStorage(key) {
  const result = await browser.storage.local.get(key);
  return result[key] !== undefined;
}
