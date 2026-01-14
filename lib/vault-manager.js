import { arrayBufferToBase64, base64ToArrayBuffer, generateRandomBytes } from './utils.js';

export async function deriveMasterKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptVault(masterPassword, vaultData) {
  const salt = generateRandomBytes(16);
  const iv = generateRandomBytes(12);
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
