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
  const [page, setPage] = useState<Pages>(Pages.Chat);

  const renderPage = (page: Pages): void => {
    setPage(page);
  }

  return (
    <PageContext.Provider value={{ page, renderPage }}>
      {children}
    </PageContext.Provider>
  );
};