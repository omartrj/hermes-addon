// Operazioni AES-GCM per cifratura e decifratura messaggi
import { arrayBufferToBase64, base64ToArrayBuffer, generateRandomBytes } from './utils.js';
import { AES_IV_LENGTH, AES_KEY_LENGTH } from '../../shared/constants.js';

/**
 * Cifra un messaggio con AES-GCM
 */
export async function encryptMessage(sharedKey, plaintext) {
  const iv = generateRandomBytes(AES_IV_LENGTH);
  const encoded = new TextEncoder().encode(plaintext);
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    sharedKey,
    encoded
  );
  
  // Concatena IV + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  return arrayBufferToBase64(combined.buffer);
}

/**
 * Decifra un messaggio con AES-GCM
 */
export async function decryptMessage(sharedKey, encryptedBase64) {
  const combined = base64ToArrayBuffer(encryptedBase64);
  const iv = combined.slice(0, AES_IV_LENGTH);
  const ciphertext = combined.slice(AES_IV_LENGTH);
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    sharedKey,
    ciphertext
  );
  
  return new TextDecoder().decode(decrypted);
}

/**
 * Esporta chiave AES in Base64
 */
export async function exportAESKey(key) {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

/**
 * Importa chiave AES da Base64
 */
export async function importAESKey(base64Key) {
  const keyData = base64ToArrayBuffer(base64Key);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: AES_KEY_LENGTH
    },
    true,
    ['encrypt', 'decrypt']
  );
}
