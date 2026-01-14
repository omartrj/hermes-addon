import { importPublicKey, importPrivateKey, deriveSharedSecret, exportAESKey, importAESKey } from './crypto-primitives.js';

export async function calculateSharedSecret(myPrivateKeyBase64, theirPublicKeyBase64) {
  const myPrivateKey = await importPrivateKey(myPrivateKeyBase64);
  const theirPublicKey = await importPublicKey(theirPublicKeyBase64);
  const sharedKey = await deriveSharedSecret(myPrivateKey, theirPublicKey);
  return await exportAESKey(sharedKey);
}

export async function getSharedKey(profiles, profileName) {
  const profile = profiles.find(p => p.name === profileName);
  if (!profile) {
    throw new Error('Profile not found');
  }
  return await importAESKey(profile.sharedSecret);
}

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

export function deleteProfile(profiles, name) {
  return profiles.filter(p => p.name !== name);
}

export function getProfileNames(profiles) {
  return profiles.map(p => p.name);
}
