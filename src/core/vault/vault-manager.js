// Vault state management and operations
import { encryptVault, decryptVault } from './vault-crypto.js';
import { generateECDHKeyPair, exportPublicKey, exportPrivateKey } from '../crypto/ecdh.js';

/**
 * Create new vault with generated keypair
 */
export async function createNewVault(masterPassword) {
  const keyPair = await generateECDHKeyPair();
  const publicKey = await exportPublicKey(keyPair.publicKey);
  const privateKey = await exportPrivateKey(keyPair.privateKey);
  
  const vaultData = {
    publicKey,
    privateKey,
    profiles: []
  };
  
  const encryptedVault = await encryptVault(masterPassword, vaultData);
  return { vaultData, encryptedVault };
}

/**
 * Unlock existing vault
 */
export async function unlockVault(masterPassword, encryptedVault) {
  return await decryptVault(masterPassword, encryptedVault);
}

/**
 * Save vault by encrypting with password
 */
export async function saveVault(masterPassword, vaultData) {
  return await encryptVault(masterPassword, vaultData);
}

/**
 * Validate vault structure
 */
export function validateVaultData(vaultData) {
  if (!vaultData || typeof vaultData !== 'object') {
    return false;
  }
  
  if (!vaultData.publicKey || !vaultData.privateKey) {
    return false;
  }
  
  if (!Array.isArray(vaultData.profiles)) {
    return false;
  }
  
  return true;
}
