// Shared view utilities to eliminate code duplication
import { local } from '../../core/storage/storage-service.js';
import * as UI from '../popup/ui-helpers.js';
import { ERROR_SELECT_PROFILE } from '../../config/constants.js';

/**
 * Save last used profile to storage
 */
export async function saveLastUsedProfile(profileName) {
  await local.set('lastUsedProfile', profileName);
}

/**
 * Get last used profile from storage
 */
export async function getLastUsedProfile() {
  return await local.get('lastUsedProfile');
}

/**
 * Validate profile selection
 * Returns profile name if valid, shows error and returns null if invalid
 */
export function validateProfileSelection(selectId, errorId) {
  const profileName = UI.getInputValue(selectId);
  
  if (!profileName) {
    UI.showError(errorId, ERROR_SELECT_PROFILE);
    return null;
  }
  
  return profileName;
}

/**
 * Prepare view for operation (clear errors and outputs)
 */
export function prepareView(errorId, ...outputIds) {
  UI.clearError(errorId);
  outputIds.forEach(id => UI.clearInput(id));
}

/**
 * Handle successful operation (clear input, save profile, return true)
 */
export async function handleOperationSuccess(inputId, profileName) {
  UI.clearInput(inputId);
  await saveLastUsedProfile(profileName);
  return true;
}

/**
 * Handle operation failure (show error, return false)
 */
export function handleOperationFailure(errorId, errorMessage) {
  UI.showError(errorId, errorMessage);
  return false;
}

/**
 * Handle paste from clipboard into input field
 */
export async function handlePasteToInput(inputId) {
  try {
    const text = await UI.pasteFromClipboard();
    UI.setInputValue(inputId, text);
  } catch (error) {
    // Silently fail - clipboard access might be denied
  }
}
