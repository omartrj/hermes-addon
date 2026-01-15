// Popup entry point - orchestration and initialization
import { getFromStorage, setInStorage } from '../../core/storage/storage-service.js';
import { saveVault } from '../../core/vault/vault-manager.js';
import * as AuthView from './auth-view.js';
import * as ProfilesView from './profiles-view.js';
import * as EncryptView from './encrypt-view.js';
import * as DecryptView from './decrypt-view.js';
import * as UI from './ui-helpers.js';

// Global application state
let currentVault = null;
let currentPassword = null;

/**
 * Application initialization
 */
async function initialize() {
  // Check if vault exists
  if (!await AuthView.vaultExists()) {
    AuthView.showCreateVaultView();
    setupEventListeners();
    return;
  }
  
  // Check session
  const settings = await getFromStorage('settings');
  const authMode = settings?.authMode || 'always';
  
  if (authMode === 'session') {
    const sessionVault = await AuthView.tryRestoreSession();
    if (sessionVault) {
      currentVault = sessionVault;
      // Password not available in session mode
      loadMainScreen();
      setupEventListeners();
      return;
    }
  }
  
  // Show unlock view
  AuthView.showUnlockVaultView();
  setupEventListeners();
}

/**
 * Load main screen after authentication
 */
function loadMainScreen() {
  UI.hide('auth-screen');
  UI.show('main-screen');
  UI.switchTab('profiles');
  ProfilesView.refreshProfilesView(currentVault);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Auth events
  document.getElementById('create-vault-btn').addEventListener('click', handleCreateVaultClick);
  document.getElementById('unlock-btn').addEventListener('click', handleUnlockVaultClick);
  document.getElementById('reset-vault-btn').addEventListener('click', handleResetVaultClick);
  
  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      UI.switchTab(e.target.dataset.tab);
    });
  });
  
  // Profiles events
  document.getElementById('copy-public-key-btn').addEventListener('click', ProfilesView.handleCopyPublicKey);
  document.getElementById('add-profile-btn').addEventListener('click', handleAddProfileClick);
  document.getElementById('paste-profile-key-btn').addEventListener('click', ProfilesView.handlePasteProfileKey);
  document.getElementById('profiles-list').addEventListener('click', handleProfilesListClick);
  
  // Encrypt events
  document.getElementById('encrypt-btn').addEventListener('click', handleEncryptClick);
  document.getElementById('copy-encrypted-btn').addEventListener('click', EncryptView.handleCopyEncrypted);
  
  // Decrypt events
  document.getElementById('decrypt-btn').addEventListener('click', handleDecryptClick);
  document.getElementById('paste-encrypted-btn').addEventListener('click', DecryptView.handlePasteEncrypted);
  
  // Enter key shortcuts
  document.getElementById('unlock-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUnlockVaultClick();
  });
}

/**
 * Handler for vault creation
 */
async function handleCreateVaultClick() {
  const result = await AuthView.handleCreateVault();
  if (result) {
    currentVault = result.vaultData;
    currentPassword = result.password;
    loadMainScreen();
  }
}

/**
 * Handler for vault unlock
 */
async function handleUnlockVaultClick() {
  const result = await AuthView.handleUnlockVault();
  if (result) {
    currentVault = result.vaultData;
    currentPassword = result.password;
    loadMainScreen();
  }
}

/**
 * Handler for vault reset
 */
async function handleResetVaultClick() {
  const success = await AuthView.handleResetVault();
  if (success) {
    currentVault = null;
    currentPassword = null;
  }
}

/**
 * Handler for profile addition
 */
async function handleAddProfileClick() {
  const updatedProfiles = await ProfilesView.handleAddProfile(currentVault);
  if (updatedProfiles) {
    currentVault.profiles = updatedProfiles;
    await saveCurrentVault();
    ProfilesView.refreshProfilesView(currentVault);
  }
}

/**
 * Handler for click in profiles list (delete)
 */
async function handleProfilesListClick(e) {
  if (e.target.tagName === 'BUTTON' && e.target.classList.contains('danger')) {
    const profileName = e.target.dataset.profileName;
    const updatedProfiles = ProfilesView.handleDeleteProfile(currentVault, profileName);
    
    if (updatedProfiles) {
      currentVault.profiles = updatedProfiles;
      await saveCurrentVault();
      ProfilesView.refreshProfilesView(currentVault);
    }
  }
}

/**
 * Handler for encryption
 */
async function handleEncryptClick() {
  await EncryptView.handleEncrypt(currentVault);
}

/**
 * Handler for decryption
 */
async function handleDecryptClick() {
  await DecryptView.handleDecrypt(currentVault);
}

/**
 * Save current vault
 */
async function saveCurrentVault() {
  // If we have password, save encrypted vault
  if (currentPassword) {
    const encryptedVault = await saveVault(currentPassword, currentVault);
    await setInStorage('vault', encryptedVault);
  }
  
  // Also update session if necessary
  const settings = await getFromStorage('settings');
  const authMode = settings?.authMode || 'always';
  
  if (authMode === 'session') {
    await setInStorage('sessionVault', currentVault);
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
