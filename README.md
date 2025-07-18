# MetaMask Wallet Connector Extension

A minimal browser extension built with WXT framework that enables MetaMask wallet connection through a simple popup interface.

## Features

- 🦊 **MetaMask Integration**: Connect to MetaMask wallet with one click
- 🔒 **Secure Communication**: Uses content scripts and main world injection
- ⚡ **Fast Development**: Built with WXT framework and Bun runtime
- 🎨 **Clean UI**: Simple React-based popup interface
- 🛡️ **MV3 Compatible**: Manifest V3 for modern browser extension standards

## Quick Start

### Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

### Load Extension in Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `.output/chrome-mv3-dev/` directory

### Production Build
```bash
# Build for production
bun run build

# Create zip for distribution
bun run zip
```

## Usage

1. Install MetaMask browser extension
2. Navigate to any website
3. Click the extension icon in toolbar
4. Click "Connect MetaMask" button
5. Accept connection request in MetaMask
6. View connected wallet address in popup

## Architecture

- **Popup**: React-based UI for wallet connection
- **Content Script**: Injects main world script and handles communication
- **Injected Script**: Accesses `window.ethereum` in page context
- **Manifest V3**: Modern extension permissions and security

## Files

- `entrypoints/popup/` - Popup UI components
- `entrypoints/content.ts` - Content script (isolated world)
- `entrypoints/injected.ts` - Main world script (window.ethereum access)
- `wxt.config.ts` - Extension configuration

## Security

- No private keys stored or transmitted
- Secure message passing between contexts
- Minimal permissions (activeTab, storage)
- Input validation and error handling# extension
