import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, sepolia } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { ethers } from "ethers";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { ICoinProvider } from "./types";

 
interface IEthereumContext extends ICoinProvider {
  provider: ethers.BrowserProvider | null,
  signer:  ethers.JsonRpcSigner | null,
}

// eslint-disable-next-line react-refresh/only-export-components
export const EthereumContext = createContext<IEthereumContext>({
  address: null,
  provider: null,
  signer: null,
  connectWallet: () => Promise.resolve(),
  disconnectWallet: () => Promise.resolve(),
})

export const EthereumProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  void loading;
  void error;

  const modal = createAppKit({
    adapters: [new EthersAdapter()],
    networks: [mainnet, sepolia],
    metadata: {
      name: "Uniswap Wrapper",
      description: "Uniswap V2 Wrapper Interface",
      url: "https://yourwebsite.com",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
    projectId: "cf32e901aa78fc3de20c50e9dd8cdd8f",
    features: {
      analytics: true,
    },
  });

  useEffect(() => {
    modal.subscribeEvents((event) => {
      if (event.data.event === "CONNECT_SUCCESS") {
        const walletProvider = modal.getWalletProvider() as ethers.Eip1193Provider;
        if (walletProvider) {
          const web3Provider = new ethers.BrowserProvider(walletProvider);
          setProvider(web3Provider);
          web3Provider.getSigner().then((signer) => {
            setSigner(signer);
            signer.getAddress().then((address) => setAddress(address));
          });
        }
      }
      if (event.data.event === "DISCONNECT_SUCCESS") {
        setProvider(null);
        setSigner(null);
        setAddress(null);
      }
    });

    if (modal.getIsConnectedState()) {
      const walletProvider = modal.getWalletProvider() as ethers.Eip1193Provider;
      if (walletProvider) {
        const web3Provider = new ethers.BrowserProvider(walletProvider);
        setProvider(web3Provider);
        web3Provider.getSigner().then((signer) => {
          setSigner(signer);
          signer.getAddress().then((address) => setAddress(address));
        });
      }
    }
  }, [modal]);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      await modal.open();
    } catch (error) {
      const { message } = (error as Error);
      setError("Failed to connect wallet: " + message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      await modal.disconnect();
      setProvider(null);
      setSigner(null);
      setAddress(null);
    } catch (error) {
      const { message } = (error as Error);
      setError("Failed to disconnect wallet: " + message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EthereumContext.Provider value={{
      address,
      provider,
      signer,
      connectWallet,
      disconnectWallet,
    }}>
      {children}
    </EthereumContext.Provider>
  )
}