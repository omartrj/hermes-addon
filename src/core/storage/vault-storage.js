// Vault storage operations - handles vault persistence
import { local } from './storage-service.js';
import { saveVault } from '../vault/vault-manager.js';

const VAULT_KEY = 'vault';

/**
 * Save encrypted vault to persistent storage
 */
export async function saveEncryptedVault(vaultData, password) {
  const encryptedVault = await saveVault(password, vaultData);
  await local.set(VAULT_KEY, encryptedVault);
  return encryptedVault;
}

/**
 * Get encrypted vault from storage
 */
export async function getEncryptedVault() {
  return await local.get(VAULT_KEY);
}

/**
 * Check if vault exists in storage
 */
export async function vaultExists() {
  const vault = await local.get(VAULT_KEY);
  return vault !== undefined;
}

/**
 * Delete vault from storage
 */
export async function deleteVault() {
  await local.remove(VAULT_KEY);
}
