export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function wrapEncryptedMessage(base64Message) {
  return `---BEGIN ENCRYPTED MESSAGE---\n${base64Message}\n---END ENCRYPTED MESSAGE---`;
}

export function unwrapEncryptedMessage(wrappedMessage) {
  const match = wrappedMessage.match(/---BEGIN ENCRYPTED MESSAGE---\s*([\s\S]*?)\s*---END ENCRYPTED MESSAGE---/);
  if (!match) {
    throw new Error('Invalid message format');
  }
  return match[1].replace(/\s+/g, '');
}

export function generateRandomBytes(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}
