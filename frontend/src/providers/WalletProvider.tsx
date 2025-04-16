import { WalletProvider as SuiProvider } from "@suiet/wallet-kit";
import { createContext, FC, ReactNode } from "react";
import { EthereumProvider } from "./EthereumProvider";

const WalletContext = createContext({})

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <EthereumProvider>
      <SuiProvider>
        <WalletContext.Provider value={{}}>
          {children}
        </WalletContext.Provider>
      </SuiProvider>
    </EthereumProvider>
  );
};