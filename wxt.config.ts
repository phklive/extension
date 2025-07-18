import { defineConfig } from 'wxt';

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: 'MetaMask Wallet Connector',
    description: 'Simple browser extension to connect with MetaMask wallet',
    version: '1.0.0',
    permissions: [
      'activeTab',
      'storage'
    ],
    host_permissions: [
      '*://*/*'
    ],
    web_accessible_resources: [
      {
        resources: ['injected.js'],
        matches: ['*://*/*']
      }
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';"
    }
  }
});