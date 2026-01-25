// Global constants for Hermes application

// SPKI header for ECDH P-256 public keys
export const SPKI_HEADER = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE';

// PBKDF2 configuration
export const PBKDF2_ITERATIONS = 100000;
export const PBKDF2_HASH = 'SHA-256';

// AES-GCM configuration
export const AES_KEY_LENGTH = 256;
export const AES_IV_LENGTH = 12;

// ECDH configuration
export const ECDH_CURVE = 'P-256';

// Salt length for PBKDF2
export const SALT_LENGTH = 16;

// Minimum master password length
export const MIN_MASTER_PASSWORD_LENGTH = 8;

// Encrypted message markers
export const MESSAGE_BEGIN_MARKER = '---BEGIN ENCRYPTED MESSAGE---';
export const MESSAGE_END_MARKER = '---END ENCRYPTED MESSAGE---';

// UI timing constants (milliseconds)
export const TOAST_DURATION = 2000;
export const BUTTON_TEXT_DURATION = 2000;
export const STATUS_MESSAGE_DURATION = 2000;

// Confirmation messages
export const CONFIRM_DELETE_PROFILE = 'Are you sure you want to delete this profile?';
export const CONFIRM_RESET_VAULT = 'Are you sure you want to reset the vault? All keys and profiles will be lost.';
export const CONFIRM_NUKE_DATA = 'WARNING: This will permanently delete ALL your data including:\n\n' +
  '- Master password vault\n' +
  '- All encryption keys\n' +
  '- All profiles\n' +
  '- Session data\n\n' +
  'This action CANNOT be undone.\n' +
  'Are you sure you want to proceed?';
export const CONFIRM_IMPORT_VAULT = 'Importing a vault will replace your current vault.\n\n' +
  'Are you sure you want to continue?';
export const PROMPT_DELETE_CONFIRMATION = 'Type DELETE in capital letters to confirm:';

// Error messages
export const ERROR_PASSWORDS_DONT_MATCH = 'Passwords do not match';
export const ERROR_PASSWORD_REQUIRED = 'Master password is required';
export const ERROR_INCORRECT_PASSWORD = 'Incorrect password';
export const ERROR_PROFILE_NAME_REQUIRED = 'Profile name is required';
export const ERROR_PUBLIC_KEY_REQUIRED = 'Public key is required';
export const ERROR_INVALID_PUBLIC_KEY = 'Invalid public key format';
export const ERROR_PROFILE_EXISTS = 'Profile already exists';
export const ERROR_SELECT_PROFILE = 'Please select a profile';
export const ERROR_MESSAGE_REQUIRED = 'Message is required';
export const ERROR_DECRYPTION_FAILED = 'Decryption failed. Invalid message or wrong key';
export const ERROR_NO_VAULT = 'No vault to export';
export const ERROR_EXPORT_FAILED = 'Export failed';
export const ERROR_IMPORT_FAILED = 'Import failed: Invalid file';
export const ERROR_INVALID_VAULT_FORMAT = 'Invalid vault file format';

// Success messages
export const SUCCESS_VAULT_CREATED = 'Vault created successfully!';
export const SUCCESS_VAULT_UNLOCKED = 'Vault unlocked!';
export const SUCCESS_PROFILE_ADDED = 'Profile added successfully!';
export const SUCCESS_PROFILE_DELETED = 'Profile deleted';
export const SUCCESS_MESSAGE_ENCRYPTED = 'Message encrypted!';
export const SUCCESS_MESSAGE_DECRYPTED = 'Message decrypted!';
export const SUCCESS_COPIED = 'Copied!';
export const SUCCESS_VAULT_EXPORTED = 'Vault exported successfully!';
export const SUCCESS_VAULT_IMPORTED = 'Vault imported successfully! Please reload the extension.';
export const SUCCESS_SETTINGS_SAVED = 'Settings saved!';
export const SUCCESS_DATA_DELETED = 'All data deleted. Please restart the extension.';

// Info messages
export const INFO_IMPORT_CANCELLED = 'Import cancelled';
export const INFO_DELETE_CANCELLED = 'Deletion cancelled';
