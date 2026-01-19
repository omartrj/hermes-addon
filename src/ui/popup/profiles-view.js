// Profiles view management (add, delete, list)
import { getCompactPublicKey } from '../../core/crypto/ecdh.js';
import { calculateSharedSecret, addProfile, deleteProfile, getProfileNames } from '../../core/profiles/profile-manager.js';
import { local } from '../../core/storage/storage-service.js';
import * as UI from './ui-helpers.js';

/**
 * Set and display user's public key
 */
export function displayMyPublicKey(publicKey) {
  const display = document.getElementById('key-display');
  const compactKey = getCompactPublicKey(publicKey);
  const cleanKey = compactKey.replace(/=+$/, '');
  const abbreviated = cleanKey.slice(0, 5).toUpperCase() + '...' + cleanKey.slice(-5).toUpperCase();
  display.textContent = abbreviated;
  display.dataset.fullKey = compactKey;
}

/**
 * Handle public key copy
 */
export async function handleCopyPublicKey() {
  const display = document.getElementById('key-display');
  const publicKey = display.dataset.fullKey;
  await UI.copyToClipboard(publicKey);
  UI.showToast('copy-toast');
}

/**
 * Render profiles list
 */
export function renderProfilesList(profiles) {
  const container = document.getElementById('profiles-list');
  container.innerHTML = '';
  
  if (profiles.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#737373;padding:20px;">No profiles yet</p>';
    return;
  }
  
  profiles.forEach(profile => {
    const item = document.createElement('div');
    item.className = 'profile-item';
    
    const name = document.createElement('span');
    name.textContent = profile.name;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'danger delete-icon-btn';
    deleteBtn.dataset.profileName = profile.name;
    deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.5a.5.5 0 0 0 0 1h.55l.72 10.09A2 2 0 0 0 5.76 15h4.48a2 2 0 0 0 1.99-1.91L12.95 3.5h.55a.5.5 0 0 0 0-1H11Z"/>
      </svg>
    `;
    
    item.appendChild(name);
    item.appendChild(deleteBtn);
    container.appendChild(item);
  });
}

/**
 * Update profile selectors in encrypt/decrypt tabs
 */
export async function updateProfileSelectors(profileNames) {
  const encryptSelect = document.getElementById('encrypt-profile-select');
  const decryptSelect = document.getElementById('decrypt-profile-select');
  
  // Get last used profile
  const lastUsedProfile = await local.get('lastUsedProfile');
  
  [encryptSelect, decryptSelect].forEach(select => {
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Select Profile --</option>';
    
    profileNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
    
    // Keep current selection if still valid
    if (profileNames.includes(currentValue)) {
      select.value = currentValue;
    }
    // Otherwise restore last used profile if available
    else if (lastUsedProfile && profileNames.includes(lastUsedProfile)) {
      select.value = lastUsedProfile;
    }
  });
}

/**
 * Handle new profile addition
 */
export async function handleAddProfile(vault) {
  const name = UI.getInputValue('profile-name').trim();
  const publicKey = UI.getInputValue('profile-public-key').trim();
  
  UI.clearError('profile-error');
  
  if (!name || !publicKey) {
    UI.showError('profile-error', 'Please fill all fields');
    return null;
  }
  
  try {
    const sharedSecret = await calculateSharedSecret(vault.privateKey, publicKey);
    const updatedProfiles = addProfile(vault.profiles, name, publicKey, sharedSecret);
    
    UI.clearInputs(['profile-name', 'profile-public-key']);
    return updatedProfiles;
  } catch (error) {
    UI.showError('profile-error', error.message || 'Failed to add profile');
    return null;
  }
}

/**
 * Handle profile deletion
 */
export function handleDeleteProfile(vault, profileName) {
  if (UI.confirmAction(`Delete profile "${profileName}"?`)) {
    return deleteProfile(vault.profiles, profileName);
  }
  return null;
}

/**
 * Handle public key paste
 */
export async function handlePasteProfileKey() {
  try {
    const text = await UI.pasteFromClipboard();
    UI.setInputValue('profile-public-key', text);
  } catch (error) {
    console.error('Paste failed:', error);
  }
}

/**
 * Fully reload profiles view
 */
export async function refreshProfilesView(vault) {
  displayMyPublicKey(vault.publicKey);
  renderProfilesList(vault.profiles);
  await updateProfileSelectors(getProfileNames(vault.profiles));
}
