import React, { createContext, useCallback, useState } from 'react';

import { wipeAuthStorage, hasToken } from './utils';

interface AuthContextValues {
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextValues>({
  isLoggedIn: hasToken(),
  setLoggedIn: () => undefined,
  logOut: () => undefined,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(hasToken());
  const setLoggedIn = useCallback((newValue: boolean) => setIsLoggedIn(newValue), []);
  const logOut = useCallback(() => {
    wipeAuthStorage();
    setIsLoggedIn(false);
  }, []);

  const value = {
    isLoggedIn,
    setLoggedIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
