// Message decryption view management
import { getSharedKey } from '../../../core/profiles/profile-manager.js';
import { decryptMessage } from '../../../core/crypto/aes.js';
import { unwrapEncryptedMessage } from '../../../core/crypto/utils.js';
import { local } from '../../../core/storage/storage-service.js';
import * as UI from '../ui-helpers.js';
import {
  ERROR_SELECT_PROFILE,
  ERROR_DECRYPTION_FAILED
} from '../../../shared/constants.js';

/**
 * Handle message decryption
 */
export async function handleDecrypt(vault) {
  const profileName = UI.getInputValue('decrypt-profile-select');
  const encryptedText = UI.getInputValue('encrypted-input');
  
  UI.clearError('decrypt-error');
  UI.clearInput('decrypted-output');
  
  // Validation
  if (!profileName) {
    UI.showError('decrypt-error', ERROR_SELECT_PROFILE);
    return false;
  }
  
  if (!encryptedText) {
    UI.showError('decrypt-error', ERROR_DECRYPTION_FAILED);
    return false;
  }
  
  try {
    const unwrapped = unwrapEncryptedMessage(encryptedText);
    const sharedKey = await getSharedKey(vault.profiles, profileName);
    const decrypted = await decryptMessage(sharedKey, unwrapped);
    
    UI.setInputValue('decrypted-output', decrypted);
    UI.clearInput('encrypted-input');
    
    // Save last used profile
    await local.set('lastUsedProfile', profileName);
    
    return true;
  } catch (error) {
    UI.showError('decrypt-error', ERROR_DECRYPTION_FAILED);
    return false;
  }
}

/**
 * Handle encrypted message paste
 */
export async function handlePasteEncrypted() {
  try {
    const text = await UI.pasteFromClipboard();
    UI.setInputValue('encrypted-input', text);
  } catch (error) {
    console.error('Paste failed:', error);
  }
}
