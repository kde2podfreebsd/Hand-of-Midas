import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Chat } from './components/Chat/Chat';
import { ChatProvider } from './contexts/ChatContext/ChatContext';
import { DashboardPage } from './pages/Dashboard.page';
import { IndexPage } from './pages/Index.page';
import { WalletPage } from './pages/Wallet.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage/>
  },
  {
    path: '/assistant', 
    element: (
      <ChatProvider>
        <DashboardPage>
          <Chat/>
        </DashboardPage>,
      </ChatProvider>
    ),
  },
  {
    path: '/wallet',
    element: (
      <DashboardPage>
        <WalletPage/>
      </DashboardPage>
    )
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
