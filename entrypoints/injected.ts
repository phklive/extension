export default defineUnlistedScript(() => {
  console.log('MetaMask Extension: Injected script loaded');

  // Listen for connection requests from content script
  window.addEventListener('message', async (event) => {
    // Only accept messages from same origin
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'CONNECT_WALLET_REQUEST' && 
        event.data.source === 'metamask-extension-content') {
      
      try {
        await connectToMetaMask();
      } catch (error) {
        sendConnectionResult({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    }
  });

  async function connectToMetaMask() {
    // Check if MetaMask is installed
    if (typeof (window as any).ethereum === 'undefined') {
      sendConnectionResult({
        success: false,
        error: 'MetaMask is not installed. Please install MetaMask extension.'
      });
      return;
    }

    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        sendConnectionResult({
          success: false,
          error: 'No accounts found. Please unlock MetaMask.'
        });
        return;
      }

      // Get the connected account
      const account = accounts[0];
      
      sendConnectionResult({
        success: true,
        account: account,
        chainId: await (window as any).ethereum.request({ method: 'eth_chainId' })
      });

    } catch (error: any) {
      let errorMessage = 'Failed to connect to MetaMask';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Please check MetaMask - connection request pending';
      } else if (error.message) {
        errorMessage = error.message;
      }

      sendConnectionResult({
        success: false,
        error: errorMessage
      });
    }
  }

  function sendConnectionResult(result: any) {
    window.postMessage({
      type: 'WALLET_CONNECTION_RESULT',
      payload: result
    }, '*');
  }
});