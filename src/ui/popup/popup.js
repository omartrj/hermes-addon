// Entry point del popup - orchestrazione e inizializzazione
import { getFromStorage, setInStorage } from '../../core/storage/storage-service.js';
import { saveVault } from '../../core/vault/vault-manager.js';
import * as AuthView from './auth-view.js';
import * as ProfilesView from './profiles-view.js';
import * as EncryptView from './encrypt-view.js';
import * as DecryptView from './decrypt-view.js';
import * as UI from './ui-helpers.js';

// Stato globale dell'applicazione
let currentVault = null;
let currentPassword = null;

/**
 * Inizializzazione dell'applicazione
 */
async function initialize() {
  // Controlla se esiste un vault
  if (!await AuthView.vaultExists()) {
    AuthView.showCreateVaultView();
    setupEventListeners();
    return;
  }
  
  // Controlla la sessione
  const settings = await getFromStorage('settings');
  const authMode = settings?.authMode || 'always';
  
  if (authMode === 'session') {
    const sessionVault = await AuthView.tryRestoreSession();
    if (sessionVault) {
      currentVault = sessionVault;
      // Password non disponibile in modalità sessione
      loadMainScreen();
      setupEventListeners();
      return;
    }
  }
  
  // Mostra unlock view
  AuthView.showUnlockVaultView();
  setupEventListeners();
}

/**
 * Carica la schermata principale dopo l'autenticazione
 */
function loadMainScreen() {
  UI.hide('auth-screen');
  UI.show('main-screen');
  UI.switchTab('profiles');
  ProfilesView.refreshProfilesView(currentVault);
}

/**
 * Setup di tutti gli event listeners
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
 * Handler per creazione vault
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
 * Handler per unlock vault
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
 * Handler per reset vault
 */
async function handleResetVaultClick() {
  const success = await AuthView.handleResetVault();
  if (success) {
    currentVault = null;
    currentPassword = null;
  }
}

/**
 * Handler per aggiunta profilo
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
 * Handler per click nella lista profili (delete)
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
 * Handler per cifratura
 */
async function handleEncryptClick() {
  await EncryptView.handleEncrypt(currentVault);
}

/**
 * Handler per decifratura
 */
async function handleDecryptClick() {
  await DecryptView.handleDecrypt(currentVault);
}

/**
 * Salva il vault corrente
 */
async function saveCurrentVault() {
  // Se abbiamo la password, salviamo il vault cifrato
  if (currentPassword) {
    const encryptedVault = await saveVault(currentPassword, currentVault);
    await setInStorage('vault', encryptedVault);
  }
  
  // Aggiorna anche la sessione se necessario
  const settings = await getFromStorage('settings');
  const authMode = settings?.authMode || 'always';
  
  if (authMode === 'session') {
    await setInStorage('sessionVault', currentVault);
  }
}

// Avvia l'applicazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initialize);
