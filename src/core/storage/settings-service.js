// Settings management - handles user preferences
import { local } from './storage-service.js';

const SETTINGS_KEY = 'settings';

/**
 * Get all settings
 */
export async function getSettings() {
  return await local.get(SETTINGS_KEY) || {};
}

/**
 * Update settings
 */
export async function updateSettings(settings) {
  await local.set(SETTINGS_KEY, settings);
}

/**
 * Get current auth mode
 */
export async function getAuthMode() {
  const settings = await getSettings();
  return settings.authMode || 'always';
}

/**
 * Set auth mode
 */
export async function setAuthMode(mode) {
  const settings = await getSettings();
  settings.authMode = mode;
  await updateSettings(settings);
}
