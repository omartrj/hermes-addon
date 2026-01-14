import { getFromStorage, setInStorage, clearStorage } from '../lib/storage-api.js';
import { generateECDHKeyPair, exportPublicKey, exportPrivateKey, encryptMessage, decryptMessage } from '../lib/crypto-primitives.js';
import { encryptVault, decryptVault } from '../lib/vault-manager.js';
import { calculateSharedSecret, getSharedKey, addProfile, deleteProfile, getProfileNames } from '../lib/profile-logic.js';
import { wrapEncryptedMessage, unwrapEncryptedMessage } from '../lib/utils.js';
import * as UI from './ui-manager.js';

let currentVault = null;

async function initialize() {
  const encryptedVault = await getFromStorage('vault');
  
  if (!encryptedVault) {
    UI.showCreateVaultView();
  } else {
    UI.showUnlockVaultView();
  }
  
  setupEventListeners();
}

function setupEventListeners() {
  document.getElementById('create-vault-btn').addEventListener('click', handleCreateVault);
  document.getElementById('unlock-btn').addEventListener('click', handleUnlockVault);
  document.getElementById('reset-vault-btn').addEventListener('click', handleResetVault);
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      UI.switchTab(e.target.dataset.tab);
    });
  });
  
  document.getElementById('copy-public-key-btn').addEventListener('click', handleCopyPublicKey);
  document.getElementById('add-profile-btn').addEventListener('click', handleAddProfile);
  document.getElementById('profiles-list').addEventListener('click', handleDeleteProfile);
  
  document.getElementById('copy-encrypted-btn').addEventListener('click', handleCopyEncrypted);
  document.getElementById('paste-encrypted-btn').addEventListener('click', () => handlePaste('encrypted-input'));
  
  document.getElementById('encrypt-btn').addEventListener('click', handleEncrypt);
  document.getElementById('decrypt-btn').addEventListener('click', handleDecrypt);
  
  document.getElementById('unlock-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUnlockVault();
  });
}

async function handleCreateVault() {
  const password = UI.getInputValue('new-master-password');
  const confirm = UI.getInputValue('confirm-master-password');
  
  UI.clearError('create-error');
  
  if (!password || password.length < 8) {
    UI.showError('create-error', 'Password must be at least 8 characters');
    return;
  }
  
  if (password !== confirm) {
    UI.showError('create-error', 'Passwords do not match');
    return;
  }
  
  try {
    const keyPair = await generateECDHKeyPair();
    const publicKey = await exportPublicKey(keyPair.publicKey);
    const privateKey = await exportPrivateKey(keyPair.privateKey);
    
    const vaultData = {
      publicKey,
      privateKey,
      profiles: []
    };
    
    const encryptedVault = await encryptVault(password, vaultData);
    await setInStorage('vault', encryptedVault);
    
    currentVault = vaultData;
    loadMainScreen();
  } catch (error) {
    UI.showError('create-error', 'Failed to create vault');
  }
}

async function handleUnlockVault() {
  const password = UI.getInputValue('unlock-password');
  
  UI.clearError('unlock-error');
  
  if (!password) {
    UI.showError('unlock-error', 'Please enter password');
    return;
  }
  
  try {
    const encryptedVault = await getFromStorage('vault');
    currentVault = await decryptVault(password, encryptedVault);
    loadMainScreen();
  } catch (error) {
    UI.showError('unlock-error', 'Incorrect password');
  }
}

async function handleResetVault() {
  if (confirm('This will delete all your data. Are you sure?')) {
    await clearStorage();
    currentVault = null;
    UI.showCreateVaultView();
    UI.clearInputs(['unlock-password']);
  }
}

function loadMainScreen() {
  UI.showMainScreen();
  UI.switchTab('profiles');
  UI.setMyPublicKey(currentVault.publicKey);
  UI.renderProfilesList(currentVault.profiles);
  UI.updateProfileSelectors(getProfileNames(currentVault.profiles));
}

async function handleCopyPublicKey() {
  const publicKey = UI.getInputValue('my-public-key');
  await UI.copyToClipboard(publicKey);
  
  const btn = document.getElementById('copy-public-key-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => {
    btn.textContent = originalText;
  }, 2000);
}

async function handleAddProfile() {
  const name = UI.getInputValue('profile-name').trim();
  const publicKey = UI.getInputValue('profile-public-key').trim();
  
  UI.clearError('profile-error');
  
  if (!name || !publicKey) {
    UI.showError('profile-error', 'Please fill all fields');
    return;
  }
  
  try {
    const sharedSecret = await calculateSharedSecret(currentVault.privateKey, publicKey);
    currentVault.profiles = addProfile(currentVault.profiles, name, publicKey, sharedSecret);
    
    await saveVault();
    
    UI.renderProfilesList(currentVault.profiles);
    UI.updateProfileSelectors(getProfileNames(currentVault.profiles));
    UI.clearInputs(['profile-name', 'profile-public-key']);
  } catch (error) {
    UI.showError('profile-error', error.message || 'Failed to add profile');
  }
}

async function handleDeleteProfile(e) {
  if (e.target.tagName === 'BUTTON' && e.target.classList.contains('danger')) {
    const profileName = e.target.dataset.profileName;
    
    if (confirm(`Delete profile "${profileName}"?`)) {
      currentVault.profiles = deleteProfile(currentVault.profiles, profileName);
      await saveVault();
      
      UI.renderProfilesList(currentVault.profiles);
      UI.updateProfileSelectors(getProfileNames(currentVault.profiles));
    }
  }
}

async function handlePaste(targetInputId) {
  try {
    const text = await UI.pasteFromClipboard();
    UI.setInputValue(targetInputId, text);
  } catch (error) {
    console.error('Paste failed:', error);
  }
}

async function handleEncrypt() {
  const profileName = UI.getInputValue('encrypt-profile-select');
  const plaintext = UI.getInputValue('plaintext-input');
  
  UI.clearError('encrypt-error');
  UI.clearInput('encrypted-output');
  
  if (!profileName) {
    UI.showError('encrypt-error', 'Please select a profile');
    return;
  }
  
  if (!plaintext) {
    UI.showError('encrypt-error', 'Please enter a message');
    return;
  }
  
  try {
    const sharedKey = await getSharedKey(currentVault.profiles, profileName);
    const encrypted = await encryptMessage(sharedKey, plaintext);
    const wrapped = wrapEncryptedMessage(encrypted);
    
    UI.setInputValue('encrypted-output', wrapped);
    UI.clearInput('plaintext-input');
  } catch (error) {
    UI.showError('encrypt-error', 'Encryption failed');
  }
}

async function handleCopyEncrypted() {
  const encryptedText = UI.getInputValue('encrypted-output');
  
  if (!encryptedText) {
    return;
  }
  
  await UI.copyToClipboard(encryptedText);
  
  const btn = document.getElementById('copy-encrypted-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => {
    btn.textContent = originalText;
  }, 2000);
}

async function handleDecrypt() {
  const profileName = UI.getInputValue('decrypt-profile-select');
  const encryptedText = UI.getInputValue('encrypted-input');
  
  UI.clearError('decrypt-error');
  UI.clearInput('decrypted-output');
  
  if (!profileName) {
    UI.showError('decrypt-error', 'Please select a profile');
    return;
  }
  
  if (!encryptedText) {
    UI.showError('decrypt-error', 'Please enter encrypted message');
    return;
  }
  
  try {
    const unwrapped = unwrapEncryptedMessage(encryptedText);
    const sharedKey = await getSharedKey(currentVault.profiles, profileName);
    const decrypted = await decryptMessage(sharedKey, unwrapped);
    
    UI.setInputValue('decrypted-output', decrypted);
    UI.clearInput('encrypted-input');
  } catch (error) {
    UI.showError('decrypt-error', 'Decryption failed - invalid format or wrong profile');
  }
}

async function saveVault() {
  const password = UI.getInputValue('unlock-password');
  const encryptedVault = await encryptVault(password, currentVault);
  await setInStorage('vault', encryptedVault);
}

document.addEventListener('DOMContentLoaded', initialize);
