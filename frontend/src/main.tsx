import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { PageProvider } from './providers/PageProvider.tsx'
import { WalletProvider } from './providers/WalletProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <PageProvider>
        <App />
      </PageProvider>
    </WalletProvider>
  </StrictMode>,
)


