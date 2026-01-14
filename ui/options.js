async function loadSettings() {
  const settings = await browser.storage.local.get('settings');
  const authMode = settings.settings?.authMode || 'always';
  
  document.querySelector(`input[value="${authMode}"]`).checked = true;
}

async function saveSettings() {
  const authMode = document.querySelector('input[name="auth-mode"]:checked').value;
  
  await browser.storage.local.set({
    settings: { authMode }
  });
  
  if (authMode === 'always') {
    await browser.storage.local.remove('sessionVault');
  }
  
  showStatus('Settings saved!');
}

function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.classList.add('show');
  setTimeout(() => {
    status.classList.remove('show');
  }, 2000);
}

async function exportVault() {
  try {
    const vault = await browser.storage.local.get('vault');
    
    if (!vault.vault) {
      showStatus('No vault to export');
      return;
    }
    
    const dataStr = JSON.stringify(vault.vault, null, 2);
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

async function nukeAllData() {
  const confirmation = confirm(
    'WARNING: This will permanently delete ALL your data including:\n\n' +
    '- Master password vault\n' +
    '- All encryption keys\n' +
    '- All profiles\n' +
    '- Session data\n\n' +
    'This action CANNOT be undone.\n\n' +
    'Type "DELETE" to confirm:'
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
    await browser.storage.local.clear();
    showStatus('All data deleted. Please restart the extension.');
  } catch (error) {
    showStatus('Failed to delete data');
  }
}

document.addEventListener('DOMContentLoaded', loadSettings);

document.querySelectorAll('input[name="auth-mode"]').forEach(radio => {
  radio.addEventListener('change', saveSettings);
});

document.getElementById('export-btn').addEventListener('click', exportVault);
document.getElementById('nuke-btn').addEventListener('click', nukeAllData);
