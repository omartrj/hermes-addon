// Settings page - configuration, export, reset management
import { getFromStorage, setInStorage, clearStorage } from '../../core/storage/storage-service.js';

/**
 * Load saved settings
 */
async function loadSettings() {
  const settings = await getFromStorage('settings');
  const authMode = settings?.authMode || 'always';
  
  document.querySelector(`input[value="${authMode}"]`).checked = true;
}

/**
 * Save settings
 */
async function saveSettings() {
  const authMode = document.querySelector('input[name="auth-mode"]:checked').value;
  
  await setInStorage('settings', { authMode });
  
  // If returning to "always", remove session
  if (authMode === 'always') {
    await browser.storage.local.remove('sessionVault');
  }
  
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
  }, 2000);
}

/**
 * Export encrypted vault
 */
async function exportVault() {
  try {
    const vault = await getFromStorage('vault');
    
    if (!vault) {
      showStatus('No vault to export');
      return;
    }
    
    const dataStr = JSON.stringify(vault, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `hermes-vault-${timestamp}.json`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    showStatus('Vault exported successfully!');
  } catch (error) {
    showStatus('Export failed');
  }
}

/**
 * Import encrypted vault
 */
async function importVault() {
  const fileInput = document.getElementById('import-file');
  fileInput.click();
}

/**
 * Handle vault file import
 */
async function handleFileImport(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }
  
  try {
    const text = await file.text();
    const vault = JSON.parse(text);
    
    // Validate vault structure
    if (!vault.encryptedPrivateKey || !vault.publicKey || !vault.profiles) {
      showStatus('Invalid vault file format');
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
    
    await setInStorage('vault', vault);
    
    // Clear session if exists
    await browser.storage.local.remove('sessionVault');
    
    showStatus('Vault imported successfully! Please reload the extension.');
  } catch (error) {
    showStatus('Import failed: Invalid file');
  } finally {
    // Reset file input
    event.target.value = '';
  }
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
    await clearStorage();
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
  document.getElementById('import-btn').addEventListener('click', importVault);
  document.getElementById('import-file').addEventListener('change', handleFileImport);
  document.getElementById('nuke-btn').addEventListener('click', nukeAllData);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
});
