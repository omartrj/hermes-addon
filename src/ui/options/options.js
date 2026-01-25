// Settings page management
import * as SessionManager from '../../core/storage/session-manager.js';
import { getAuthMode } from '../../core/storage/settings-service.js';
import { local } from '../../core/storage/storage-service.js';
import {
  STATUS_MESSAGE_DURATION,
  SUCCESS_SETTINGS_SAVED,
  SUCCESS_VAULT_EXPORTED,
  ERROR_NO_VAULT,
  ERROR_EXPORT_FAILED,
  ERROR_INVALID_VAULT_FORMAT,
  ERROR_IMPORT_FAILED,
  CONFIRM_IMPORT_VAULT,
  CONFIRM_NUKE_DATA,
  PROMPT_DELETE_CONFIRMATION,
  INFO_IMPORT_CANCELLED,
  INFO_DELETE_CANCELLED,
  SUCCESS_VAULT_IMPORTED,
  SUCCESS_DATA_DELETED
} from '../../config/constants.js';

/**
 * Load saved settings
 */
async function loadSettings() {
  const authMode = await getAuthMode();
  document.querySelector(`input[value="${authMode}"]`).checked = true;
}

/**
 * Save settings
 */
async function saveSettings() {
  const authMode = document.querySelector('input[name="auth-mode"]:checked').value;
  await SessionManager.setAuthMode(authMode);
  showStatus(SUCCESS_SETTINGS_SAVED);
}

/**
 * Show status message
 */
function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.classList.add('show');
  setTimeout(() => {
    status.classList.remove('show');
  }, STATUS_MESSAGE_DURATION);
}

/**
 * Export encrypted vault
 */
async function exportVault() {
  try {
    const vault = await SessionManager.getEncryptedVault();
    
    if (!vault) {
      showStatus(ERROR_NO_VAULT);
      return;
    }
    
    const dataStr = JSON.stringify(vault, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hermes-vault-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showStatus(SUCCESS_VAULT_EXPORTED);
  } catch (error) {
    showStatus(ERROR_EXPORT_FAILED);
  }
}

/**
 * Import encrypted vault
 */
async function importVault(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const vault = JSON.parse(text);
    
    if (!vault || !vault.data || !vault.iv || !vault.salt) {
      showStatus(ERROR_INVALID_VAULT_FORMAT);
      return;
    }
    
    const confirmation = confirm(CONFIRM_IMPORT_VAULT);
    
    if (!confirmation) {
      showStatus(INFO_IMPORT_CANCELLED);
      return;
    }
    
    await local.set('vault', vault);
    await SessionManager.clearSession();
    
    showStatus(SUCCESS_VAULT_IMPORTED);
  } catch (error) {
    showStatus(ERROR_IMPORT_FAILED);
  } finally {
    event.target.value = '';
  }
}

/**
 * Handle file input click
 */
function handleImportClick() {
  document.getElementById('import-file-input').click();
}

/**
 * Delete all data (nuke)
 */
async function nukeAllData() {
  const confirmation = confirm(CONFIRM_NUKE_DATA);
  
  if (!confirmation) {
    return;
  }
  
  const typed = prompt(PROMPT_DELETE_CONFIRMATION);
  
  if (typed !== 'DELETE') {
    showStatus(INFO_DELETE_CANCELLED);
    return;
  }
  
  try {
    await SessionManager.deleteAllData();
    showStatus(SUCCESS_DATA_DELETED);
  } catch (error) {
    showStatus(ERROR_EXPORT_FAILED);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  document.querySelectorAll('input[name="auth-mode"]').forEach(radio => {
    radio.addEventListener('change', saveSettings);
  });
  
  document.getElementById('export-btn').addEventListener('click', exportVault);
  document.getElementById('import-btn').addEventListener('click', handleImportClick);
  document.getElementById('import-file-input').addEventListener('change', importVault);
  document.getElementById('nuke-btn').addEventListener('click', nukeAllData);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
});
