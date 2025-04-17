import { createContext, FC, ReactNode, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export enum Pages {
  Chat = 'Chat',
  Pools = 'Pools',
  Protocols = "Protocols",
  Transactions = "Transactions",
  Survey = "Survey",
  Analytics = "Analytics",
  Actives = "Actives",
}

interface IPageContext {
  page: Pages;
  renderPage: (page: Pages) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const PageContext = createContext<IPageContext>({
  page: Pages.Chat,
  renderPage: (page) => void(page)
});



export const PageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const lsPage = window.localStorage.getItem('menuItem') as Pages | null;
  const [page, setPage] = useState<Pages>(lsPage ?? Pages.Chat);

  const renderPage = (page: Pages): void => {
    window.localStorage.setItem('menuItem', page)
    setPage(page);
  }

  return (
    <PageContext.Provider value={{ page, renderPage }}>
      {children}
    </PageContext.Provider>
  );
};