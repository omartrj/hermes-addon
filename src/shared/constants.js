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

// Encrypted message markers
export const MESSAGE_BEGIN_MARKER = '---BEGIN ENCRYPTED MESSAGE---';
export const MESSAGE_END_MARKER = '---END ENCRYPTED MESSAGE---';
