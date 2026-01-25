// ECDH key exchange management and public/private key operations
import { arrayBufferToBase64, base64ToArrayBuffer } from './utils.js';
import { 
  ECDH_CURVE, 
  SPKI_HEADER, 
  AES_KEY_LENGTH
} from '../../config/constants.js';

/**
 * Generate new ECDH key pair
 */
export async function generateECDHKeyPair() {
  return await crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: ECDH_CURVE
    },
    true,
    ['deriveKey', 'deriveBits']
  );
}

/**
 * Export public key in Base64 format
 */
export async function exportPublicKey(publicKey) {
  const exported = await crypto.subtle.exportKey('spki', publicKey);
  return arrayBufferToBase64(exported);
}

/**
 * Remove SPKI header for compact key
 */
export function getCompactPublicKey(fullPublicKey) {
  if (fullPublicKey.startsWith(SPKI_HEADER)) {
    return fullPublicKey.slice(SPKI_HEADER.length);
  }
  return fullPublicKey;
}

/**
 * Add SPKI header for full key
 */
export function expandCompactPublicKey(compactKey) {
  if (!compactKey.startsWith(SPKI_HEADER)) {
    return SPKI_HEADER + compactKey;
  }
  return compactKey;
}

/**
 * Import public key from Base64
 */
export async function importPublicKey(base64Key) {
  const fullKey = expandCompactPublicKey(base64Key);
  const keyData = base64ToArrayBuffer(fullKey);
  return await crypto.subtle.importKey(
    'spki',
    keyData,
    {
      name: 'ECDH',
      namedCurve: ECDH_CURVE
    },
    true,
    []
  );
}

/**
 * Export private key in Base64 format
 */
export async function exportPrivateKey(privateKey) {
  const exported = await crypto.subtle.exportKey('pkcs8', privateKey);
  return arrayBufferToBase64(exported);
}

/**
 * Import private key from Base64
 */
export async function importPrivateKey(base64Key) {
  const keyData = base64ToArrayBuffer(base64Key);
  return await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    {
      name: 'ECDH',
      namedCurve: ECDH_CURVE
    },
    true,
    ['deriveKey', 'deriveBits']
  );
}

/**
 * Derive shared secret from ECDH keys (returns AES key)
 */
export async function deriveSharedSecret(privateKey, publicKey) {
  return await crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: publicKey
    },
    privateKey,
    {
      name: 'AES-GCM',
      length: AES_KEY_LENGTH
    },
    true,
    ['encrypt', 'decrypt']
  );
}
