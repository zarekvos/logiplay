import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const isMetaMaskAvailable = () => {
  return typeof window !== 'undefined' && 
         typeof window.ethereum !== 'undefined' && 
         window.ethereum.isMetaMask;
};

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    
    try {
      if (!isMetaMaskAvailable()) {
        setIsLoading(false);
        alert('MetaMask wallet is required!');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        setAddress(account);
        setIsConnected(true);
        
        try {
          const balanceWei = await window.ethereum!.request({
            method: 'eth_getBalance',
            params: [account, 'latest'],
          });
          
          const balanceEth = (parseInt(balanceWei, 16) / 1e18).toFixed(4);
          setBalance(balanceEth);
        } catch (balanceError) {
          console.warn('Could not fetch balance:', balanceError);
          setBalance('0.0000');
        }
        
        localStorage.setItem('mazefi_wallet_connected', 'true');
        localStorage.setItem('mazefi_wallet_address', account);
        
        console.log('Wallet connected successfully:', account);
      }
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      if (error.code === 4001) {
        alert('Connection rejected by user. Please try again.');
      } else if (error.code === -32002) {
        alert('Connection request pending. Please check MetaMask.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    localStorage.removeItem('mazefi_wallet_connected');
    localStorage.removeItem('mazefi_wallet_address');
  };

  useEffect(() => {
    const wasConnected = localStorage.getItem('mazefi_wallet_connected');
    const savedAddress = localStorage.getItem('mazefi_wallet_address');
    
    if (wasConnected === 'true' && savedAddress && isMetaMaskAvailable()) {
      window.ethereum!.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0 && accounts[0] === savedAddress) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        })
        .catch(() => {
          localStorage.removeItem('mazefi_wallet_connected');
          localStorage.removeItem('mazefi_wallet_address');
        });
    }
  }, []);

  useEffect(() => {
    if (isMetaMaskAvailable()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== address) {
          setAddress(accounts[0]);
          localStorage.setItem('mazefi_wallet_address', accounts[0]);
        }
      };

      window.ethereum!.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [address]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
