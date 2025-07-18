import React, { useState, useEffect } from 'react';

interface WalletState {
  connected: boolean;
  account: string | null;
  connecting: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    account: null,
    connecting: false,
    error: null
  });

  const connectWallet = async () => {
    setWalletState(prev => ({ ...prev, connecting: true, error: null }));
    
    try {
      // Send message to content script to initiate wallet connection
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { 
          type: 'CONNECT_WALLET' 
        });
        
        if (response.success) {
          setWalletState({
            connected: true,
            account: response.account,
            connecting: false,
            error: null
          });
        } else {
          setWalletState(prev => ({
            ...prev,
            connecting: false,
            error: response.error || 'Failed to connect wallet'
          }));
        }
      }
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        connecting: false,
        error: 'Failed to communicate with page'
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      connected: false,
      account: null,
      connecting: false,
      error: null
    });
  };

  return (
    <div style={{ 
      width: '300px', 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h2 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px', 
        textAlign: 'center' 
      }}>
        MetaMask Connector
      </h2>
      
      {!walletState.connected ? (
        <button
          onClick={connectWallet}
          disabled={walletState.connecting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: walletState.connecting ? '#cccccc' : '#f6851b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: walletState.connecting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {walletState.connecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      ) : (
        <div>
          <p style={{ 
            margin: '0 0 10px 0', 
            color: '#10b981', 
            textAlign: 'center' 
          }}>
            ✅ Connected
          </p>
          <p style={{ 
            margin: '0 0 15px 0', 
            fontSize: '12px', 
            wordBreak: 'break-all',
            backgroundColor: '#f5f5f5',
            padding: '8px',
            borderRadius: '4px'
          }}>
            {walletState.account}
          </p>
          <button
            onClick={disconnectWallet}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Disconnect
          </button>
        </div>
      )}
      
      {walletState.error && (
        <p style={{ 
          margin: '15px 0 0 0', 
          color: '#ef4444', 
          fontSize: '12px',
          textAlign: 'center'
        }}>
          {walletState.error}
        </p>
      )}
    </div>
  );
};

export default App;