import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, sepolia } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { ethers } from "ethers";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { Protocols } from "../constants";
import { UniswapWrapperABI } from "./abi";
import { ICoinProvider } from "./types";
import { UserContext } from "./UserProvider";

const UNISWAP_WRAPPER_ADDRESS = "0xa4c7531a815ffcbb343aa381ae6be677822d7dab";
const ETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
const USDT_ADDRESS = "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0";
 
interface IEthereumContext extends ICoinProvider {
  provider: ethers.BrowserProvider | null,
  signer:  ethers.JsonRpcSigner | null,
  swapHardcode: () => Promise<void>,
}

// eslint-disable-next-line react-refresh/only-export-components
export const EthereumContext = createContext<IEthereumContext>({
  address: null,
  provider: null,
  signer: null,
  connectWallet: () => Promise.resolve(),
  disconnectWallet: () => Promise.resolve(),
  swapHardcode: () => Promise.resolve(),
})

export const EthereumProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useContext(UserContext)

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
    if (user && address) {
      api.user.sync(Protocols.ETH, address, user)
    }
  }, [address, user])

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
      throw error;
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getContract = () => {
    if (!signer) throw new Error("Wallet not connected");
  
    return new ethers.Contract(
      UNISWAP_WRAPPER_ADDRESS,
      UniswapWrapperABI,
      signer
    );
  };

  const swapHardcode = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const contract = getContract();
      const amount = ethers.parseEther("0.0005");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
      const path = [ETH_ADDRESS, USDT_ADDRESS];

      const tx = await contract.swapExactETHForTokens(
        0,
        path,
        address,
        deadline,
        { value: amount }
      );

      await tx.wait();
    } catch (error) {
      const { message } = error as Error;
      setError("Swap failed: " + message);
      throw error;
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
      swapHardcode,
    }}>
      {children}
    </EthereumContext.Provider>
  )
}