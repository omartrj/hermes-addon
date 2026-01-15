// Gestione stato e operazioni del vault
import { encryptVault, decryptVault } from './vault-crypto.js';
import { generateECDHKeyPair, exportPublicKey, exportPrivateKey } from '../crypto/ecdh.js';

/**
 * Crea un nuovo vault con keypair generato
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
 * Sblocca un vault esistente
 */
export async function unlockVault(masterPassword, encryptedVault) {
  return await decryptVault(masterPassword, encryptedVault);
}

/**
 * Salva il vault cifrandolo con la password
 */
export async function saveVault(masterPassword, vaultData) {
  return await encryptVault(masterPassword, vaultData);
}

/**
 * Valida la struttura del vault
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
