[<img src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg" alt="for Firefox" height="60px">](https://addons.mozilla.org/it/firefox/addon/hermes-messanger/)

# <img src="icons/icon-48.png" alt="Hermes Logo" width="32"> Hermes

**End-to-end encrypted messaging using ECDH key exchange and AES-GCM encryption. Secure your online conversations.**

Hermes is a Firefox extension that adds end-to-end encryption to **any** web-based messaging platform, including those that *already implement it* (such as WhatsApp Web, Telegram, and Facebook Messenger). Only you and your recipient can read your messages.

Hermes relies on proven cryptographic standards to ensure the confidentiality and integrity of your communications:

* **Key Agreement:** [Elliptic-curve Diffie–Hellman (ECDH)](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman) using the **P-256** curve to establish a shared secret.
* **Encryption/Decryption:** [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) (256-bit) for authenticated encryption.
* **Key Derivation:** [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) (100,000 iterations) to derive encryption keys from your master password.

## Features

* **Platform Agnostic:** Works on top of any web messaging service.
* **Zero Knowledge:** Your keys never leave your browser. No data collection or external servers.
* **Local Vault:** Secure storage protected by a master password.
* **Profile Management:** Store and organize public keys for your contacts.
* **Clipboard Integration:** Easily encrypt and decrypt messages from the clipboard.
* **Open Source:** Transparent and written in vanilla JavaScript. No external libraries/dependencies.

## Installation

You can install Hermes using one of the following methods:

### 1. Firefox Add-ons Store (Recommended)

The easiest way to keep Hermes updated is to install it directly from the official store:

* [Install Hermes for Firefox](https://addons.mozilla.org/it/firefox/addon/hermes-messenger/)

### 2. GitHub Releases (.xpi)

If you prefer to install a specific version or want to avoid the store:

1. Go to the [Releases](https://github.com/omartrj/hermes-addon/releases) page.
2. Download the latest `.xpi` file.
3. Open Firefox and type `about:addons` in the address bar.
4. Click the gear icon (⚙️) and select **Install Add-on From File...**.
5. Select the downloaded `.xpi` file.

> You may need to enable installation of add-ons from file in `about:config` by setting `xpinstall.signatures.required` to `false`.

## How it Works

1. **Setup:** Create a master password to initialize your local encrypted vault.
2. **Key Exchange:** Share your public key with a contact and import theirs.
3. **Encrypt:** Type your message, click encrypt, and send the ciphertext through your messaging app.
4. **Decrypt:** Copy the received ciphertext and use Hermes to reveal the original message.

> **Note:** Both participants must have Hermes installed to communicate.

---

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests to improve the security or features of Hermes.