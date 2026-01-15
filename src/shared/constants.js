// Costanti globali per l'applicazione Hermes

// Header SPKI per chiavi pubbliche ECDH P-256
export const SPKI_HEADER = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE';

// Configurazione PBKDF2
export const PBKDF2_ITERATIONS = 100000;
export const PBKDF2_HASH = 'SHA-256';

// Configurazione AES-GCM
export const AES_KEY_LENGTH = 256;
export const AES_IV_LENGTH = 12;

// Configurazione ECDH
export const ECDH_CURVE = 'P-256';

// Lunghezza salt per PBKDF2
export const SALT_LENGTH = 16;

// Marker per messaggi cifrati
export const MESSAGE_BEGIN_MARKER = '---BEGIN ENCRYPTED MESSAGE---';
export const MESSAGE_END_MARKER = '---END ENCRYPTED MESSAGE---';
