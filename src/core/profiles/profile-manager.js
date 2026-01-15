// Gestione profili contatti e shared secrets
import { importPublicKey, importPrivateKey, deriveSharedSecret } from '../crypto/ecdh.js';
import { exportAESKey, importAESKey } from '../crypto/aes.js';

/**
 * Calcola il shared secret tra due chiavi
 */
export async function calculateSharedSecret(myPrivateKeyBase64, theirPublicKeyBase64) {
  const myPrivateKey = await importPrivateKey(myPrivateKeyBase64);
  const theirPublicKey = await importPublicKey(theirPublicKeyBase64);
  const sharedKey = await deriveSharedSecret(myPrivateKey, theirPublicKey);
  return await exportAESKey(sharedKey);
}

/**
 * Ottiene la chiave condivisa per un profilo
 */
export async function getSharedKey(profiles, profileName) {
  const profile = profiles.find(p => p.name === profileName);
  if (!profile) {
    throw new Error('Profile not found');
  }
  return await importAESKey(profile.sharedSecret);
}

/**
 * Aggiunge un nuovo profilo
 */
export function addProfile(profiles, name, publicKey, sharedSecret) {
  const existing = profiles.find(p => p.name === name);
  if (existing) {
    throw new Error('Profile already exists');
  }
  
  profiles.push({
    name,
    publicKey,
    sharedSecret
  });
  
  return profiles;
}

/**
 * Rimuove un profilo
 */
export function deleteProfile(profiles, name) {
  return profiles.filter(p => p.name !== name);
}

/**
 * Ottiene i nomi di tutti i profili
 */
export function getProfileNames(profiles) {
  return profiles.map(p => p.name);
}

/**
 * Trova un profilo per nome
 */
export function findProfile(profiles, name) {
  return profiles.find(p => p.name === name);
}

/**
 * Valida i dati di un profilo
 */
export function validateProfile(name, publicKey) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Invalid profile name');
  }
  
  if (!publicKey || typeof publicKey !== 'string' || publicKey.trim().length === 0) {
    throw new Error('Invalid public key');
  }
  
  return true;
}
