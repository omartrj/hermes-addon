// Gestione view cifratura messaggi
import { getSharedKey } from '../../core/profiles/profile-manager.js';
import { encryptMessage } from '../../core/crypto/aes.js';
import { wrapEncryptedMessage } from '../../core/crypto/utils.js';
import * as UI from './ui-helpers.js';

/**
 * Gestisce la cifratura di un messaggio
 */
export async function handleEncrypt(vault) {
  const profileName = UI.getInputValue('encrypt-profile-select');
  const plaintext = UI.getInputValue('plaintext-input');
  
  UI.clearError('encrypt-error');
  UI.clearInput('encrypted-output');
  
  // Validazione
  if (!profileName) {
    UI.showError('encrypt-error', 'Please select a profile');
    return false;
  }
  
  if (!plaintext) {
    UI.showError('encrypt-error', 'Please enter a message');
    return false;
  }
  
  try {
    const sharedKey = await getSharedKey(vault.profiles, profileName);
    const encrypted = await encryptMessage(sharedKey, plaintext);
    const wrapped = wrapEncryptedMessage(encrypted);
    
    UI.setInputValue('encrypted-output', wrapped);
    UI.clearInput('plaintext-input');
    
    return true;
  } catch (error) {
    UI.showError('encrypt-error', 'Encryption failed');
    return false;
  }
}

/**
 * Gestisce la copia del messaggio cifrato
 */
export async function handleCopyEncrypted() {
  const encryptedText = UI.getInputValue('encrypted-output');
  
  if (!encryptedText) {
    return;
  }
  
  await UI.copyToClipboard(encryptedText);
  
  const btn = document.getElementById('copy-encrypted-btn');
  const originalText = btn.textContent;
  UI.setButtonText('copy-encrypted-btn', 'Copied!', originalText);
}
