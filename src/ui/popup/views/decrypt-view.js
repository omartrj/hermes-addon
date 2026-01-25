// Message decryption view management
import { getSharedKey } from '../../../core/profiles/profile-manager.js';
import { decryptMessage } from '../../../core/crypto/aes.js';
import { unwrapEncryptedMessage } from '../../../core/crypto/utils.js';
import * as UI from '../ui-helpers.js';
import { ERROR_DECRYPTION_FAILED } from '../../../shared/constants.js';
import {
  validateProfileSelection,
  prepareView,
  handleOperationSuccess,
  handleOperationFailure,
  handlePasteToInput
} from './view-helpers.js';

/**
 * Handle message decryption
 */
export async function handleDecrypt(vault) {
  prepareView('decrypt-error', 'decrypted-output');
  
  const profileName = validateProfileSelection('decrypt-profile-select', 'decrypt-error');
  if (!profileName) return false;
  
  const encryptedText = UI.getInputValue('encrypted-input');
  if (!encryptedText) {
    return handleOperationFailure('decrypt-error', ERROR_DECRYPTION_FAILED);
  }
  
  try {
    const unwrapped = unwrapEncryptedMessage(encryptedText);
    const sharedKey = await getSharedKey(vault.profiles, profileName);
    const decrypted = await decryptMessage(sharedKey, unwrapped);
    
    UI.setInputValue('decrypted-output', decrypted);
    return await handleOperationSuccess('encrypted-input', profileName);
  } catch (error) {
    return handleOperationFailure('decrypt-error', ERROR_DECRYPTION_FAILED);
  }
}

/**
 * Handle encrypted message paste
 */
export async function handlePasteEncrypted() {
  await handlePasteToInput('encrypted-input');
}
