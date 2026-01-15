// Vault encryption and decryption with master password
import { arrayBufferToBase64, base64ToArrayBuffer, generateRandomBytes } from '../crypto/utils.js';
import { deriveMasterKey } from '../crypto/key-derivation.js';
import { SALT_LENGTH, AES_IV_LENGTH } from '../../shared/constants.js';

/**
 * Encrypt vault data with master password
 */
export async function encryptVault(masterPassword, vaultData) {
  const salt = generateRandomBytes(SALT_LENGTH);
  const iv = generateRandomBytes(AES_IV_LENGTH);
  const masterKey = await deriveMasterKey(masterPassword, salt);
  
  const encoded = new TextEncoder().encode(JSON.stringify(vaultData));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    masterKey,
    encoded
  );
  
  return {
    salt: arrayBufferToBase64(salt.buffer),
    iv: arrayBufferToBase64(iv.buffer),
    data: arrayBufferToBase64(encrypted)
  };
}

/**
 * Decrypt vault data with master password
 */
export async function decryptVault(masterPassword, encryptedVault) {
  const salt = base64ToArrayBuffer(encryptedVault.salt);
  const iv = base64ToArrayBuffer(encryptedVault.iv);
  const data = base64ToArrayBuffer(encryptedVault.data);
  
  const masterKey = await deriveMasterKey(masterPassword, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    masterKey,
    data
  );
  
  const json = new TextDecoder().decode(decrypted);
  return JSON.parse(json);
}
