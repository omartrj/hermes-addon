// Message encryption view management
import { getSharedKey } from '../../../core/profiles/profile-manager.js';
import { encryptMessage } from '../../../core/crypto/aes.js';
import { wrapEncryptedMessage } from '../../../core/crypto/utils.js';
import * as UI from '../ui-helpers.js';
import { ERROR_MESSAGE_REQUIRED, ERROR_ENCRYPTION_FAILED } from '../../../shared/constants.js';
import {
  validateProfileSelection,
  prepareView,
  handleOperationSuccess,
  handleOperationFailure
} from './view-helpers.js';

/**
 * Handle message encryption
 */
export async function handleEncrypt(vault) {
  prepareView('encrypt-error', 'encrypted-output');
  
  const profileName = validateProfileSelection('encrypt-profile-select', 'encrypt-error');
  if (!profileName) return false;
  
  const plaintext = UI.getInputValue('plaintext-input');
  if (!plaintext) {
    return handleOperationFailure('encrypt-error', ERROR_MESSAGE_REQUIRED);
  }
  
  try {
    const sharedKey = await getSharedKey(vault.profiles, profileName);
    const encrypted = await encryptMessage(sharedKey, plaintext);
    const wrapped = wrapEncryptedMessage(encrypted);
    
    UI.setInputValue('encrypted-output', wrapped);
    return await handleOperationSuccess('plaintext-input', profileName);
  } catch (error) {
    return handleOperationFailure('encrypt-error', ERROR_ENCRYPTION_FAILED);
  }
}

/**
 * Handle encrypted message copy
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
