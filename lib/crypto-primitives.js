import { arrayBufferToBase64, base64ToArrayBuffer } from './utils.js';

export async function generateECDHKeyPair() {
  return await crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256'
    },
    true,
    ['deriveKey', 'deriveBits']
  );
}

export async function exportPublicKey(publicKey) {
  const exported = await crypto.subtle.exportKey('spki', publicKey);
  return arrayBufferToBase64(exported);
}

const SPKI_HEADER = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE';

export function getCompactPublicKey(fullPublicKey) {
  if (fullPublicKey.startsWith(SPKI_HEADER)) {
    return fullPublicKey.slice(SPKI_HEADER.length);
  }
  return fullPublicKey;
}

export function expandCompactPublicKey(compactKey) {
  if (!compactKey.startsWith('MF')) {
    return SPKI_HEADER + compactKey;
  }
  return compactKey;
}

export async function importPublicKey(base64Key) {
  const fullKey = expandCompactPublicKey(base64Key);
  const keyData = base64ToArrayBuffer(fullKey);
  return await crypto.subtle.importKey(
    'spki',
    keyData,
    {
      name: 'ECDH',
      namedCurve: 'P-256'
    },
    true,
    []
  );
}

export async function exportPrivateKey(privateKey) {
  const exported = await crypto.subtle.exportKey('pkcs8', privateKey);
  return arrayBufferToBase64(exported);
}

export async function importPrivateKey(base64Key) {
  const keyData = base64ToArrayBuffer(base64Key);
  return await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    {
      name: 'ECDH',
      namedCurve: 'P-256'
    },
    true,
    ['deriveKey', 'deriveBits']
  );
}

export async function deriveSharedSecret(privateKey, publicKey) {
  return await crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: publicKey
    },
    privateKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptMessage(sharedKey, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    sharedKey,
    encoded
  );
  
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  return arrayBufferToBase64(combined.buffer);
}

export async function decryptMessage(sharedKey, encryptedBase64) {
  const combined = base64ToArrayBuffer(encryptedBase64);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  
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

export async function exportAESKey(key) {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

export async function importAESKey(base64Key) {
  const keyData = base64ToArrayBuffer(base64Key);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}
