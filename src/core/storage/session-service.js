// Session state management - handles temporary session data
import { session } from './storage-service.js';
import { getAuthMode } from './settings-service.js';

const SESSION_STATE_KEY = 'sessionState';

/**
 * Save session state (vault + password)
 * Only used in 'session' auth mode
 */
export async function saveSessionState(vaultData, password) {
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
export async function restoreSessionState() {
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
export async function clearSessionState() {
  await session.clear();
}

/**
 * Check if session is active
 */
export async function hasActiveSession() {
  const authMode = await getAuthMode();
  if (authMode !== 'session') {
    return false;
  }
  
  const sessionState = await session.get(SESSION_STATE_KEY);
  return sessionState !== undefined && sessionState !== null;
}
