// Session orchestrator - coordinates session, vault and settings
// This module orchestrates high-level operations across multiple services
import { local, session } from './storage-service.js';
import { getAuthMode, setAuthMode as updateAuthMode } from './settings-service.js';
import { saveEncryptedVault, getEncryptedVault, vaultExists } from './vault-storage.js';
import { saveSessionState, restoreSessionState, clearSessionState } from './session-service.js';

/**
 * Get current auth mode
 */
export async function getAuthModeFromSettings() {
  return await getAuthMode();
}

/**
 * Set auth mode and clear session if needed
 */
export async function setAuthMode(mode) {
  await updateAuthMode(mode);
  
  // Clear session when switching to 'always' mode
  if (mode === 'always') {
    await clearSessionState();
  }
}

/**
 * Save session state (vault + password)
 * Only used in 'session' auth mode
 */
export async function saveSession(vaultData, password) {
  await saveSessionState(vaultData, password);
}

/**
 * Restore session state
 * Returns { vault, password } or null
 */
export async function restoreSession() {
  return await restoreSessionState();
}

/**
 * Clear session state
 */
export async function clearSession() {
  await clearSessionState();
}

/**
 * Save vault to persistent storage and update session if needed
 */
export async function persistVault(vaultData, password) {
  // Save encrypted vault to local storage
  await saveEncryptedVault(vaultData, password);
  
  // Update session if in session mode
  await saveSessionState(vaultData, password);
}

/**
 * Get encrypted vault from storage
 */
export { getEncryptedVault };

/**
 * Check if vault exists
 */
export { vaultExists };

/**
 * Delete all data (vault + session + settings)
 */
export async function deleteAllData() {
  await local.clear();
  await session.clear();
}
