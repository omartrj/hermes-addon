// User interface utilities
// Handles DOM manipulation, clipboard, error messages
import { TOAST_DURATION, BUTTON_TEXT_DURATION } from '../../shared/constants.js';

/**
 * Show/hide elements
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
 * Error message management
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
 * Tab management
 */
export function switchTab(tabName) {
  // Deselect all buttons and content
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    content.classList.add('hidden');
  });
  
  // Activate selected tab
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.remove('hidden');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

/**
 * Input management
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
 * Clipboard management
 */
export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

export async function pasteFromClipboard() {
  return await navigator.clipboard.readText();
}

/**
 * Show toast notification
 */
export function showToast(elementId, duration = TOAST_DURATION) {
  const toast = document.getElementById(elementId);
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Temporary button state management
 */
export function setButtonText(elementId, text, originalText, duration = BUTTON_TEXT_DURATION) {
  const btn = document.getElementById(elementId);
  btn.textContent = text;
  setTimeout(() => {
    btn.textContent = originalText;
  }, duration);
}

/**
 * Confirm actions
 */
export function confirmAction(message) {
  return confirm(message);
}

export function promptUser(message) {
  return prompt(message);
}
