import '@mantine/core/styles.css';
import "@suiet/wallet-kit/style.css"; // Add this line to your code

import { MantineProvider } from '@mantine/core';
import { WalletProvider } from '@suiet/wallet-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from './Router';


const chatClient = new QueryClient()

export default function App() {
  return (
    <MantineProvider>
      <WalletProvider>
        <QueryClientProvider client={chatClient}>
          <Router />
        </QueryClientProvider>
      </WalletProvider>
    </MantineProvider>
  );
}
