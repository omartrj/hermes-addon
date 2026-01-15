// Derivazione chiave master da password con PBKDF2
import { PBKDF2_ITERATIONS, PBKDF2_HASH, AES_KEY_LENGTH } from '../../shared/constants.js';

/**
 * Deriva una chiave AES da password usando PBKDF2
 */
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
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: AES_KEY_LENGTH
    },
    false,
    ['encrypt', 'decrypt']
  );
}
