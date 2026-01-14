export function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('main-screen').classList.add('hidden');
}

export function showMainScreen() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('main-screen').classList.remove('hidden');
}

export function showCreateVaultView() {
  document.getElementById('create-vault-view').classList.remove('hidden');
  document.getElementById('unlock-vault-view').classList.add('hidden');
}

export function showUnlockVaultView() {
  document.getElementById('create-vault-view').classList.add('hidden');
  document.getElementById('unlock-vault-view').classList.remove('hidden');
}

export function showError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  setTimeout(() => {
    element.textContent = '';
  }, 5000);
}

export function clearError(elementId) {
  document.getElementById(elementId).textContent = '';
}

export function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    content.classList.add('hidden');
  });
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.remove('hidden');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

export function setMyPublicKey(publicKey) {
  const display = document.getElementById('key-display');
  const cleanKey = publicKey.replace(/=+$/, '');
  const abbreviated = cleanKey.slice(0, 5).toUpperCase() + '...' + cleanKey.slice(-5).toUpperCase();
  display.textContent = abbreviated;
  display.dataset.fullKey = publicKey;
}

export function renderProfilesList(profiles) {
  const container = document.getElementById('profiles-list');
  container.innerHTML = '';
  
  profiles.forEach(profile => {
    const item = document.createElement('div');
    item.className = 'profile-item';
    
    const name = document.createElement('span');
    name.textContent = profile.name;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'danger';
    deleteBtn.dataset.profileName = profile.name;
    
    item.appendChild(name);
    item.appendChild(deleteBtn);
    container.appendChild(item);
  });
}

export function updateProfileSelectors(profileNames) {
  const encryptSelect = document.getElementById('encrypt-profile-select');
  const decryptSelect = document.getElementById('decrypt-profile-select');
  
  [encryptSelect, decryptSelect].forEach(select => {
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Select Profile --</option>';
    
    profileNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
    
    if (profileNames.includes(currentValue)) {
      select.value = currentValue;
    }
  });
}

export function getInputValue(elementId) {
  return document.getElementById(elementId).value;
}

export function setInputValue(elementId, value) {
  document.getElementById(elementId).value = value;
}

export function clearInput(elementId) {
  document.getElementById(elementId).value = '';
}

export function clearInputs(elementIds) {
  elementIds.forEach(id => clearInput(id));
}

export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

export async function pasteFromClipboard() {
  return await navigator.clipboard.readText();
}
