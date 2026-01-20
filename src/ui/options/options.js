// Settings page management
import * as SessionManager from '../../core/storage/session-manager.js';
import { local } from '../../core/storage/storage-service.js';
import { STATUS_MESSAGE_DURATION } from '../../shared/constants.js';

/**
 * Load saved settings
 */
async function loadSettings() {
  const authMode = await SessionManager.getAuthMode();
  document.querySelector(`input[value="${authMode}"]`).checked = true;
}

/**
 * Save settings
 */
async function saveSettings() {
  const authMode = document.querySelector('input[name="auth-mode"]:checked').value;
  await SessionManager.setAuthMode(authMode);
  showStatus('Settings saved!');
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
      showStatus('No vault to export');
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
    showStatus('Vault exported successfully');
  } catch (error) {
    showStatus('Export failed');
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
      showStatus('Invalid vault file');
      return;
    }
    
    const confirmation = confirm(
      'Importing a vault will replace your current vault.\n\n' +
      'Are you sure you want to continue?'
    );
    
    if (!confirmation) {
      showStatus('Import cancelled');
      return;
    }
    
    await local.set('vault', vault);
    await SessionManager.clearSession();
    
    showStatus('Vault imported successfully! Please reload the extension.');
  } catch (error) {
    showStatus('Import failed: Invalid file');
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
  const confirmation = confirm(
    'WARNING: This will permanently delete ALL your data including:\n\n' +
    '- Master password vault\n' +
    '- All encryption keys\n' +
    '- All profiles\n' +
    '- Session data\n\n' +
    'This action CANNOT be undone.\n' +
    'Are you sure you want to proceed?'
  );
  
  if (!confirmation) {
    return;
  }
  
  const typed = prompt('Type DELETE in capital letters to confirm:');
  
  if (typed !== 'DELETE') {
    showStatus('Deletion cancelled');
    return;
  }
  
  try {
    await SessionManager.deleteAllData();
    showStatus('All data deleted. Please restart the extension.');
  } catch (error) {
    showStatus('Failed to delete data');
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
