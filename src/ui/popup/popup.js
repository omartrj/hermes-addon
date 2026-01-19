// Popup entry point - orchestration
import * as SessionManager from '../../core/storage/session-manager.js';
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
  
  // Try to restore session
  const sessionState = await AuthView.tryRestoreSession();
  if (sessionState) {
    currentVault = sessionState.vault;
    currentPassword = sessionState.password;
    await loadMainScreen();
    setupEventListeners();
    return;
  }
  
  // Show unlock view
  AuthView.showUnlockVaultView();
  setupEventListeners();
}

/**
 * Load main screen after authentication
 */
async function loadMainScreen() {
  UI.hide('auth-screen');
  UI.show('main-screen');
  UI.switchTab('profiles');
  await ProfilesView.refreshProfilesView(currentVault);
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
    currentVault = result.vault;
    currentPassword = result.password;
    await loadMainScreen();
  }
}

/**
 * Handler for vault unlock
 */
async function handleUnlockVaultClick() {
  const result = await AuthView.handleUnlockVault();
  if (result) {
    currentVault = result.vault;
    currentPassword = result.password;
    await loadMainScreen();
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
    await saveVault();
    await ProfilesView.refreshProfilesView(currentVault);
  }
}

/**
 * Handler for profile deletion
 */
async function handleProfilesListClick(e) {
  if (e.target.tagName === 'BUTTON' && e.target.classList.contains('danger')) {
    const profileName = e.target.dataset.profileName;
    const updatedProfiles = ProfilesView.handleDeleteProfile(currentVault, profileName);
    
    if (updatedProfiles) {
      currentVault.profiles = updatedProfiles;
      await saveVault();
      await ProfilesView.refreshProfilesView(currentVault);
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
 * Save vault (both persistent and session)
 */
async function saveVault() {
  await SessionManager.persistVault(currentVault, currentPassword);
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
