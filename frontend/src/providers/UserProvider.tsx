import { createContext, ReactNode, useEffect, useState } from "react";

export interface IUserContext {
  user: string | null,
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<IUserContext>({
  user: null
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(window.localStorage.getItem('userId'))

  useEffect(() => {
    if (!user) {
      const userId = String(Date.now())
      window.localStorage.setItem('userId', userId)
      setUser(userId);
    }
  }, [user])

  return (
    <UserContext.Provider value={{
      user
    }}>
      {children}
    </UserContext.Provider>
  );
}