// Gestione view di autenticazione (create vault / unlock)
import { createNewVault, unlockVault } from '../../core/vault/vault-manager.js';
import { getFromStorage, setInStorage, clearStorage } from '../../core/storage/storage-service.js';
import * as UI from './ui-helpers.js';

/**
 * Mostra la view di creazione vault
 */
export function showCreateVaultView() {
  UI.show('create-vault-view');
  UI.hide('unlock-vault-view');
  UI.focusInput('new-master-password');
}

/**
 * Mostra la view di unlock vault
 */
export function showUnlockVaultView() {
  UI.hide('create-vault-view');
  UI.show('unlock-vault-view');
  UI.focusInput('unlock-password');
}

/**
 * Gestisce la creazione di un nuovo vault
 */
export async function handleCreateVault() {
  const password = UI.getInputValue('new-master-password');
  const confirm = UI.getInputValue('confirm-master-password');
  
  UI.clearError('create-error');
  
  // Validazione
  if (!password || password.length < 8) {
    UI.showError('create-error', 'Password must be at least 8 characters');
    return null;
  }
  
  if (password !== confirm) {
    UI.showError('create-error', 'Passwords do not match');
    return null;
  }
  
  try {
    const { vaultData, encryptedVault } = await createNewVault(password);
    await setInStorage('vault', encryptedVault);
    
    return { vaultData, password };
  } catch (error) {
    UI.showError('create-error', 'Failed to create vault');
    return null;
  }
}

/**
 * Gestisce l'unlock del vault
 */
export async function handleUnlockVault() {
  const password = UI.getInputValue('unlock-password');
  
  UI.clearError('unlock-error');
  
  if (!password) {
    UI.showError('unlock-error', 'Please enter password');
    return null;
  }
  
  try {
    const encryptedVault = await getFromStorage('vault');
    const vaultData = await unlockVault(password, encryptedVault);
    
    // Gestione session storage
    const settings = await getFromStorage('settings');
    const authMode = settings?.authMode || 'always';
    
    if (authMode === 'session') {
      await setInStorage('sessionVault', vaultData);
    }
    
    return { vaultData, password };
  } catch (error) {
    UI.showError('unlock-error', 'Incorrect password');
    return null;
  }
}

/**
 * Gestisce il reset del vault
 */
export async function handleResetVault() {
  if (UI.confirmAction('This will delete all your data. Are you sure?')) {
    await clearStorage();
    UI.clearInputs(['unlock-password']);
    showCreateVaultView();
    return true;
  }
  return false;
}

/**
 * Verifica se esiste un vault
 */
export async function vaultExists() {
  const vault = await getFromStorage('vault');
  return vault !== undefined;
}

/**
 * Prova a recuperare vault dalla sessione
 */
export async function tryRestoreSession() {
  const sessionVault = await getFromStorage('sessionVault');
  return sessionVault;
}
