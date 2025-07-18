// WXT auto-imports defineContentScript

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  
  async main() {
    // Inject script into main world to access window.ethereum
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'CONNECT_WALLET') {
        handleWalletConnection(sendResponse);
        return true; // Keep message channel open for async response
      }
    });

    // Listen for messages from injected script
    window.addEventListener('message', (event) => {
      // Only accept messages from same origin
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'WALLET_CONNECTION_RESULT') {
        // Store the result for popup to use
        const result = event.data.payload;
        if (pendingConnection) {
          pendingConnection(result);
          pendingConnection = null;
        }
      }
    });
  }
});

let pendingConnection: ((result: any) => void) | null = null;

async function handleWalletConnection(sendResponse: (response: any) => void) {
  // Set up promise to wait for injected script response
  pendingConnection = sendResponse;
  
  // Send message to injected script to connect wallet
  window.postMessage({
    type: 'CONNECT_WALLET_REQUEST',
    source: 'metamask-extension-content'
  }, '*');
  
  // Set timeout for connection attempt
  setTimeout(() => {
    if (pendingConnection) {
      pendingConnection({
        success: false,
        error: 'Connection timeout'
      });
      pendingConnection = null;
    }
  }, 10000); // 10 second timeout
}