export interface ICoinProvider {
  address: string | null;
  connectWallet(): Promise<void>;
  disconnectWallet(): Promise<void>;
}
