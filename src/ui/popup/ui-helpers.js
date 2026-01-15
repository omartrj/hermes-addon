// Utilities per l'interfaccia utente
// Gestisce DOM manipulation, clipboard, messaggi di errore

/**
 * Mostra/nasconde elementi
 */
export function show(elementId) {
  document.getElementById(elementId).classList.remove('hidden');
}

export function hide(elementId) {
  document.getElementById(elementId).classList.add('hidden');
}

export function toggle(elementId) {
  document.getElementById(elementId).classList.toggle('hidden');
}

/**
 * Gestione messaggi di errore
 */
export function showError(elementId, message, duration = 5000) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  if (duration > 0) {
    setTimeout(() => {
      clearError(elementId);
    }, duration);
  }
}

export function clearError(elementId) {
  document.getElementById(elementId).textContent = '';
}

/**
 * Gestione tabs
 */
export function switchTab(tabName) {
  // Deseleziona tutti i bottoni e contenuti
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    content.classList.add('hidden');
  });
  
  // Attiva tab selezionato
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.remove('hidden');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

/**
 * Gestione input
 */
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

export function focusInput(elementId) {
  document.getElementById(elementId).focus();
}

/**
 * Gestione clipboard
 */
export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

export async function pasteFromClipboard() {
  return await navigator.clipboard.readText();
}

/**
 * Mostra toast notification
 */
export function showToast(elementId, duration = 2000) {
  const toast = document.getElementById(elementId);
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Gestione button state temporaneo
 */
export function setButtonText(elementId, text, originalText, duration = 2000) {
  const btn = document.getElementById(elementId);
  btn.textContent = text;
  setTimeout(() => {
    btn.textContent = originalText;
  }, duration);
}

/**
 * Conferma azioni
 */
export function confirmAction(message) {
  return confirm(message);
}

export function promptUser(message) {
  return prompt(message);
}
