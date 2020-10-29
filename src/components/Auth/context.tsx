import React, {
  createContext,
  useCallback,
  useState,
} from 'react';

import { wipeAuthStorage, hasToken, getValidToken as resolveValidToken } from './utils';

interface AuthContextValues {
  isLoggedIn: boolean;
  setLoggedIn(isLoggedIn: boolean): void;
  logOut(): void;
  getValidToken(): Promise<AuthToken>;
}

const AuthContext = createContext<AuthContextValues>({
  isLoggedIn: hasToken(),
  setLoggedIn: () => undefined,
  logOut: () => undefined,
  getValidToken: () => resolveValidToken(),
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(hasToken());
  const setLoggedIn = useCallback((newValue: boolean) => setIsLoggedIn(newValue), []);
  const logOut = useCallback(() => {
    wipeAuthStorage();
    setIsLoggedIn(false);
  }, []);
  const getValidToken = useCallback(() => resolveValidToken(), []);

  const value = {
    isLoggedIn,
    setLoggedIn,
    logOut,
    getValidToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
