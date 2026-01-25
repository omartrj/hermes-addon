// Authentication view management
import { createNewVault, unlockVault } from '../../../core/vault/vault-manager.js';
import * as SessionManager from '../../../core/storage/session-manager.js';
import * as UI from '../ui-helpers.js';
import {
  MIN_MASTER_PASSWORD_LENGTH,
  ERROR_PASSWORDS_DONT_MATCH,
  ERROR_PASSWORD_REQUIRED,
  ERROR_PASSWORD_TOO_SHORT,
  ERROR_INCORRECT_PASSWORD,
  ERROR_VAULT_CREATION_FAILED,
  CONFIRM_RESET_VAULT
} from '../../../config/constants.js';

/**
 * Show vault creation view
 */
export function showCreateVaultView() {
  UI.show('create-vault-view');
  UI.hide('unlock-vault-view');
  UI.focusInput('new-master-password');
}

/**
 * Show vault unlock view
 */
export function showUnlockVaultView() {
  UI.hide('create-vault-view');
  UI.show('unlock-vault-view');
  UI.focusInput('unlock-password');
}

/**
 * Handle new vault creation
 */
export async function handleCreateVault() {
  const password = UI.getInputValue('new-master-password');
  const confirm = UI.getInputValue('confirm-master-password');
  
  UI.clearError('create-error');
  
  if (!password || password.length < MIN_MASTER_PASSWORD_LENGTH) {
    UI.showError('create-error', ERROR_PASSWORD_TOO_SHORT);
    return null;
  }
  
  if (password !== confirm) {
    UI.showError('create-error', ERROR_PASSWORDS_DONT_MATCH);
    return null;
  }
  
  try {
    const { vaultData, encryptedVault } = await createNewVault(password);
    await SessionManager.persistVault(vaultData, password);
    
    return { vault: vaultData, password };
  } catch (error) {
    UI.showError('create-error', ERROR_VAULT_CREATION_FAILED);
    return null;
  }
}

/**
 * Handle vault unlock
 */
export async function handleUnlockVault() {
  const password = UI.getInputValue('unlock-password');
  
  UI.clearError('unlock-error');
  
  if (!password) {
    UI.showError('unlock-error', ERROR_PASSWORD_REQUIRED);
    return null;
  }
  
  try {
    const encryptedVault = await SessionManager.getEncryptedVault();
    const vaultData = await unlockVault(password, encryptedVault);
    
    // Save session for future use
    await SessionManager.saveSession(vaultData, password);
    
    return { vault: vaultData, password };
  } catch (error) {
    UI.showError('unlock-error', ERROR_INCORRECT_PASSWORD);
    return null;
  }
}

/**
 * Handle vault reset
 */
export async function handleResetVault() {
  if (UI.confirmAction(CONFIRM_RESET_VAULT)) {
    await SessionManager.deleteAllData();
    UI.clearInputs(['unlock-password']);
    showCreateVaultView();
    return true;
  }
  return false;
}

/**
 * Check if vault exists
 */
export async function vaultExists() {
  return await SessionManager.vaultExists();
}

/**
 * Try to restore vault from session
 */
export async function tryRestoreSession() {
  return await SessionManager.restoreSession();
}
