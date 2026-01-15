// Gestione view decifratura messaggi
import { getSharedKey } from '../../core/profiles/profile-manager.js';
import { decryptMessage } from '../../core/crypto/aes.js';
import { unwrapEncryptedMessage } from '../../core/crypto/utils.js';
import * as UI from './ui-helpers.js';

/**
 * Gestisce la decifratura di un messaggio
 */
export async function handleDecrypt(vault) {
  const profileName = UI.getInputValue('decrypt-profile-select');
  const encryptedText = UI.getInputValue('encrypted-input');
  
  UI.clearError('decrypt-error');
  UI.clearInput('decrypted-output');
  
  // Validazione
  if (!profileName) {
    UI.showError('decrypt-error', 'Please select a profile');
    return false;
  }
  
  if (!encryptedText) {
    UI.showError('decrypt-error', 'Please enter encrypted message');
    return false;
  }
  
  try {
    const unwrapped = unwrapEncryptedMessage(encryptedText);
    const sharedKey = await getSharedKey(vault.profiles, profileName);
    const decrypted = await decryptMessage(sharedKey, unwrapped);
    
    UI.setInputValue('decrypted-output', decrypted);
    UI.clearInput('encrypted-input');
    
    return true;
  } catch (error) {
    UI.showError('decrypt-error', 'Decryption failed - invalid format or wrong profile');
    return false;
  }
}

/**
 * Gestisce il paste del messaggio cifrato
 */
export async function handlePasteEncrypted() {
  try {
    const text = await UI.pasteFromClipboard();
    UI.setInputValue('encrypted-input', text);
  } catch (error) {
    console.error('Paste failed:', error);
  }
}
