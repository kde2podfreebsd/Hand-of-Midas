import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, optimismSepolia, sepolia } from "@reown/appkit/networks";
import { UniswapWrapperABI } from "./UniswapWrapperABI";

// Конфигурация Reown AppKit
const projectId = "cf32e901aa78fc3de20c50e9dd8cdd8f";

const metadata = {
  name: "Uniswap Wrapper",
  description: "Uniswap V2 Wrapper Interface",
  url: "https://yourwebsite.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  //networks: [mainnet, sepolia],
  networks: [sepolia],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

// MAINNET
// const UNISWAP_WRAPPER_ADDRESS = "";
// const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
// const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

// SEPOLIA TESTNET
const UNISWAP_WRAPPER_ADDRESS = "0x53e344167C5778Ef77ebEb1Ba281D7aAF59944eA";
const ETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
const USDT_ADDRESS = "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [amountETH, setAmountETH] = useState("");
  const [amountToken, setAmountToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    modal.subscribeEvents((event) => {
      if (event.data.event === "CONNECT_SUCCESS") {
        const walletProvider = modal.getWalletProvider();
        if (walletProvider) {
          const web3Provider = new ethers.BrowserProvider(walletProvider);
          setProvider(web3Provider);
          web3Provider.getSigner().then((signer) => {
            setSigner(signer);
            signer.getAddress().then((address) => setAccount(address));
          });
        }
      }
      if (event.data.event === "DISCONNECT_SUCCESS") {
        setProvider(null);
        setSigner(null);
        setAccount(null);
      }
    });

    if (modal.getIsConnectedState()) {
      const walletProvider = modal.getWalletProvider();
      if (walletProvider) {
        const web3Provider = new ethers.BrowserProvider(walletProvider);
        setProvider(web3Provider);
        web3Provider.getSigner().then((signer) => {
          setSigner(signer);
          signer.getAddress().then((address) => setAccount(address));
        });
      }
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      await modal.open();
    } catch (error) {
      setError("Failed to connect wallet: " + error.message);
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
      setAccount(null);
    } catch (error) {
      setError("Failed to disconnect wallet: " + error.message);
      console.error(error);
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

  const swapETHForTokens = async () => {
    setLoading(true);
    setError(null);
    try {
      const contract = getContract();
      const amount = ethers.parseEther(amountETH || "0");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
      const path = [ETH_ADDRESS, USDT_ADDRESS];

      const tx = await contract.swapExactETHForTokens(
        0,
        path,
        account,
        deadline,
        { value: amount }
      );

      await tx.wait();
      alert("Swap successful!");
      setAmountETH("");
    } catch (error) {
      setError("Swap failed: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const swapTokensForETH = async () => {
    setLoading(true);
    setError(null);
    try {
      const contract = getContract();
      const tokenContract = new ethers.Contract(
        USDT_ADDRESS,
        [
          "function approve(address,uint256) external",
          "function allowance(address,address) view returns (uint256)",
        ],
        signer
      );

      const amount = ethers.parseUnits(amountToken || "0", 6);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
      const path = [USDT_ADDRESS, ETH_ADDRESS];

      await tokenContract.approve(UNISWAP_WRAPPER_ADDRESS, amount);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const tx = await contract.swapExactTokensForETH(
        amount,
        0,
        path,
        account,
        deadline
      );

      await tx.wait();
      alert("Swap successful!");
      setAmountToken("");
    } catch (error) {
      setError("Swap failed: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addLiquidity = async () => {
    setLoading(true);
    setError(null);
    try {
      const contract = getContract();
      const tokenContract = new ethers.Contract(
        USDT_ADDRESS,
        ["function approve(address,uint256) external"],
        signer
      );

      const ethAmount = ethers.parseEther(amountETH || "0");
      const tokenAmount = ethers.parseUnits(amountToken || "0", 6);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      await tokenContract.approve(UNISWAP_WRAPPER_ADDRESS, tokenAmount);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const tx = await contract.addLiquidityETH(
        USDT_ADDRESS,
        tokenAmount,
        0,
        0,
        account,
        deadline,
        { value: ethAmount }
      );

      await tx.wait();
      alert("Liquidity added successfully!");
      setAmountETH("");
      setAmountToken("");
    } catch (error) {
      setError("Transaction failed: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        <h1 className="text-2xl font-bold">Uniswap V2 Wrapper</h1>

        {error && (
          <div className="p-3 bg-red-600 text-white rounded-lg text-center w-full">
            {error}
          </div>
        )}

        {loading && <div className="text-center text-gray-400">Loading...</div>}

        {!account ? (
          <button
            className="w-48 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            onClick={connectWallet}
            disabled={loading}
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex flex-col items-center space-y-4 w-full">
            <p className="text-gray-400">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
            <div className="flex gap-4 w-full">
              <input
                type="number"
                placeholder="ETH Amount"
                value={amountETH}
                onChange={(e) => setAmountETH(e.target.value)}
                className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                type="number"
                placeholder="USDT Amount"
                value={amountToken}
                onChange={(e) => setAmountToken(e.target.value)}
                className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div className="flex gap-3">
              <button
                className="w-36 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
                onClick={swapETHForTokens}
                disabled={loading || !amountETH}
              >
                Swap ETH → USDT
              </button>
              <button
                className="w-36 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
                onClick={swapTokensForETH}
                disabled={loading || !amountToken}
              >
                Swap USDT → ETH
              </button>
              <button
                className="w-36 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                onClick={addLiquidity}
                disabled={loading || !amountETH || !amountToken}
              >
                Add Liquidity
              </button>
            </div>
            <button
              className="w-48 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
              onClick={disconnectWallet}
              disabled={loading}
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
