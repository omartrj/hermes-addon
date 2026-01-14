# Hermes - End-to-End Encrypted Messaging

Hermes is a Firefox extension that provides end-to-end encryption for messaging platforms like WhatsApp, Telegram, and Facebook Messenger.

## Features

- **ECDH Key Exchange**: Uses P-256 curve for secure key agreement
- **AES-GCM Encryption**: 256-bit encryption for messages
- **Master Password Protection**: Vault protected with PBKDF2 (100,000 iterations)
- **Profile Management**: Create profiles for different contacts
- **Clipboard Integration**: Easy copy/paste functionality
- **Vanilla JavaScript**: No external dependencies

## Installation

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the project directory

## Usage

### First Time Setup

1. Click the Hermes icon in your browser toolbar
2. Create a master password (minimum 8 characters)
3. Your keypair is automatically generated

### Adding a Contact

1. Share your public key with your contact (copy it from the Profiles tab)
2. Get their public key
3. In the Profiles tab, click "Add New Profile"
4. Enter a name for the contact and paste their public key
5. The shared secret is calculated automatically

### Encrypting Messages

1. Select the Encrypt tab
2. Choose the recipient profile
3. Type or paste your message
4. Click "Encrypt"
5. The encrypted message is automatically copied to clipboard
6. Paste it into WhatsApp/Telegram/etc.

### Decrypting Messages

1. Copy the encrypted message you received
2. Select the Decrypt tab
3. Choose the sender's profile
4. Paste the encrypted message
5. Click "Decrypt"
6. Read the decrypted message

## Architecture

```
hermes/
├── manifest.json
├── lib/
│   ├── crypto-primitives.js    # Web Crypto API wrappers
│   ├── vault-manager.js         # Master password & vault encryption
│   ├── profile-logic.js         # Profile & shared secret management
│   ├── storage-api.js           # Browser storage wrapper
│   └── utils.js                 # Base64 & message formatting
├── ui/
│   ├── popup.html               # Extension popup UI
│   ├── popup.css                # Styling
│   ├── ui-manager.js            # DOM manipulation
│   └── event-handlers.js        # Event coordination
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

## Security Notes

- All keys are stored encrypted with your master password
- The extension never transmits your keys anywhere
- Each profile uses a unique shared secret derived from ECDH
- Messages use AES-GCM with random IVs for each encryption
- If you forget your master password, you must reset the vault (losing all data)

## License

MIT
