// Gestione ECDH key exchange e operazioni su chiavi pubbliche/private
import { arrayBufferToBase64, base64ToArrayBuffer } from './utils.js';
import { ECDH_CURVE, SPKI_HEADER, AES_KEY_LENGTH } from '../../shared/constants.js';

/**
 * Genera una nuova coppia di chiavi ECDH
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
 * Esporta chiave pubblica in formato Base64
 */
export async function exportPublicKey(publicKey) {
  const exported = await crypto.subtle.exportKey('spki', publicKey);
  return arrayBufferToBase64(exported);
}

/**
 * Rimuove l'header SPKI per chiave compatta
 */
export function getCompactPublicKey(fullPublicKey) {
  if (fullPublicKey.startsWith(SPKI_HEADER)) {
    return fullPublicKey.slice(SPKI_HEADER.length);
  }
  return fullPublicKey;
}

/**
 * Aggiunge l'header SPKI per chiave completa
 */
export function expandCompactPublicKey(compactKey) {
  if (!compactKey.startsWith('MF')) {
    return SPKI_HEADER + compactKey;
  }
  return compactKey;
}

/**
 * Importa chiave pubblica da Base64
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
 * Esporta chiave privata in formato Base64
 */
export async function exportPrivateKey(privateKey) {
  const exported = await crypto.subtle.exportKey('pkcs8', privateKey);
  return arrayBufferToBase64(exported);
}

/**
 * Importa chiave privata da Base64
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
 * Deriva shared secret da chiavi ECDH (restituisce AES key)
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
