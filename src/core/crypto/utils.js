// Utilities crittografiche per conversioni e formatting
import { MESSAGE_BEGIN_MARKER, MESSAGE_END_MARKER } from '../../shared/constants.js';

/**
 * Converte ArrayBuffer in stringa Base64
 */
export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converte stringa Base64 in ArrayBuffer
 */
export function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Wrappa un messaggio cifrato con marker visibili
 */
export function wrapEncryptedMessage(base64Message) {
  return `${MESSAGE_BEGIN_MARKER}\n${base64Message}\n${MESSAGE_END_MARKER}`;
}

/**
 * Estrae il messaggio cifrato dai marker
 */
export function unwrapEncryptedMessage(wrappedMessage) {
  const pattern = new RegExp(
    `${MESSAGE_BEGIN_MARKER.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*([\\s\\S]*?)\\s*${MESSAGE_END_MARKER.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`
  );
  const match = wrappedMessage.match(pattern);
  if (!match) {
    throw new Error('Invalid message format');
  }
  return match[1].replace(/\s+/g, '');
}

/**
 * Genera bytes random per IV o salt
 */
export function generateRandomBytes(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}
