// Session management - handles auth modes and session state
import { local, session } from './storage-service.js';
import { saveVault } from '../vault/vault-manager.js';

const SETTINGS_KEY = 'settings';
const VAULT_KEY = 'vault';
const SESSION_STATE_KEY = 'sessionState';

/**
 * Get current auth mode
 */
export async function getAuthMode() {
  const settings = await local.get(SETTINGS_KEY);
  return settings?.authMode || 'always';
}

/**
 * Set auth mode
 */
export async function setAuthMode(mode) {
  await local.set(SETTINGS_KEY, { authMode: mode });
  
  // Clear session when switching to 'always' mode
  if (mode === 'always') {
    await session.clear();
  }
}

/**
 * Save session state (vault + password)
 * Only used in 'session' auth mode
 */
export async function saveSession(vaultData, password) {
  const authMode = await getAuthMode();
  
  if (authMode === 'session') {
    await session.set(SESSION_STATE_KEY, {
      vault: vaultData,
      password: password,
      timestamp: Date.now()
    });
  }
}

/**
 * Restore session state
 * Returns { vault, password } or null
 */
export async function restoreSession() {
  const authMode = await getAuthMode();
  
  if (authMode !== 'session') {
    return null;
  }
  
  const sessionState = await session.get(SESSION_STATE_KEY);
  
  if (!sessionState) {
    return null;
  }
  
  return {
    vault: sessionState.vault,
    password: sessionState.password
  };
}

/**
 * Clear session state
 */
export async function clearSession() {
  await session.clear();
}

/**
 * Save vault to persistent storage and update session if needed
 */
export async function persistVault(vaultData, password) {
  // Always save encrypted vault to local storage
  const encryptedVault = await saveVault(password, vaultData);
  await local.set(VAULT_KEY, encryptedVault);
  
  // Update session if in session mode
  await saveSession(vaultData, password);
}

/**
 * Get encrypted vault from storage
 */
export async function getEncryptedVault() {
  return await local.get(VAULT_KEY);
}

/**
 * Check if vault exists
 */
export async function vaultExists() {
  const vault = await local.get(VAULT_KEY);
  return vault !== undefined;
}

/**
 * Delete all data (vault + session + settings)
 */
export async function deleteAllData() {
  await local.clear();
  await session.clear();
}
